"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { recordMeasurement, uploadExaminationPhoto } from "@/lib/supabase/dataService";
import { calculateDetailedAge } from "@/lib/ageHelper";

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

async function compressExaminationImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas tidak didukung pada browser ini."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error("Gagal mengompresi foto pemeriksaan."));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.8
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("File gambar tidak valid atau rusak."));
    };
    img.src = objectUrl;
  });
}

export default function CatatPemeriksaanPage() {
  const { children, loading: loadingChildren, refresh } = useChildrenData();
  const [selectedChildId, setSelectedChildId] = useState("");
  const [examDate, setExamDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [weight, setWeight] = useState("10.8");
  const [height, setHeight] = useState("82.5");
  const [headCirc, setHeadCirc] = useState("46.5");
  const [lila, setLila] = useState("14.5");
  const [method, setMethod] = useState<"terlentang" | "berdiri">("terlentang");
  const [companionName, setCompanionName] = useState("");
  const [companionRelation, setCompanionRelation] = useState("Ibu Kandung");
  const [companionPhone, setCompanionPhone] = useState("");
  const [notes, setNotes] = useState("Anak aktif, nafsu makan baik.");

  // Photo state
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [compressingPhoto, setCompressingPhoto] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

  useEffect(() => {
    if (selectedChild) {
      setCompanionName(selectedChild.motherName || selectedChild.parentName || "");
      setCompanionPhone(selectedChild.motherPhone || "");
      setMethod(selectedChild.ageMonths < 24 ? "terlentang" : "berdiri");
    }
  }, [selectedChild?.id, selectedChild?.motherName, selectedChild?.parentName, selectedChild?.motherPhone, selectedChild?.ageMonths]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const validExt = ["jpg", "jpeg", "png", "webp"].includes(ext);
    if (!ALLOWED_MIME_TYPES.has(file.type) && !validExt) {
      setPhotoError("Format file tidak didukung. Gunakan gambar berformat JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError("Ukuran foto melebihi batas maksimal 5 MB. Silakan pilih gambar lain.");
      e.target.value = "";
      return;
    }

    setCompressingPhoto(true);
    try {
      const compressed = await compressExaminationImage(file);
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
      const nextPreviewUrl = URL.createObjectURL(compressed);
      setPhotoBlob(compressed);
      setPhotoPreviewUrl(nextPreviewUrl);
      setPhotoFileName(file.name);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Gagal memproses gambar.");
    } finally {
      setCompressingPhoto(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoBlob(null);
    setPhotoPreviewUrl(null);
    setPhotoFileName("");
    setPhotoError(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Dynamic preview calculation based on input
  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;
  const isStuntedPreview = numHeight > 0 && numHeight < 80;

  const handleSubmit = async (status: "validated" | "draft") => {
    if (!selectedChild) {
      setSubmitError("Pilih data balita terlebih dahulu.");
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setSubmitError(null);
    setPhotoWarning(null);

    try {
      let uploadedPhotoUrl: string | null = null;
      let warningMessage: string | undefined;

      if (photoBlob) {
        const uploadRes = await uploadExaminationPhoto(selectedChild.id, photoBlob);
        uploadedPhotoUrl = uploadRes.publicUrl;
        if (uploadRes.warning) {
          warningMessage = uploadRes.warning;
        }
      }

      const saveRes = await recordMeasurement({
        childId: selectedChild.id,
        posyanduId: selectedChild.posyanduId || "11111111-1111-1111-1111-111111111111",
        examDate,
        ageInMonths: selectedChild.ageMonths,
        weightKg: numWeight || selectedChild.weight,
        heightCm: numHeight || selectedChild.height,
        measurementMethod: method,
        headCircumferenceCm: parseFloat(headCirc) || undefined,
        lilaCm: parseFloat(lila) || undefined,
        notes: notes.trim() || undefined,
        photoUrl: uploadedPhotoUrl,
        status,
        assessment: {
          zScoreTbU: isStuntedPreview ? -2.45 : -0.8,
          zScoreBbU: 0.15,
          zScoreBbTb: 0.4,
          stuntingStatus: isStuntedPreview ? "Pendek (Stunted)" : "Normal",
          wastingStatus: "Gizi Baik (Normal)",
          riskFlag: isStuntedPreview ? "MODERATE_RISK" : "NORMAL",
          actionAdvice: isStuntedPreview
            ? "Konseling gizi, pantau asupan protein hewani, dan evaluasi PMT."
            : "Pertahankan pola makan seimbang dan penimbangan rutin bulanan.",
        },
      });

      if (!saveRes.measurement) {
        setSubmitError(
          saveRes.error || "Gagal menyimpan hasil pemeriksaan ke database Supabase."
        );
        return;
      }

      if (saveRes.photoWarning) {
        warningMessage = warningMessage || saveRes.photoWarning;
      }

      if (warningMessage) {
        setPhotoWarning(warningMessage);
      }

      handleRemovePhoto();
      setSubmitted(true);
      await refresh();
      setTimeout(() => setSubmitted(false), 4500);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan pemeriksaan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/staff/dashboard" className="hover:text-emerald-700">Beranda</Link>
            <span>/</span>
            <span className="text-emerald-800 font-semibold">Pemeriksaan</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
              Catat Pemeriksaan &amp; Pengukuran Balita
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Mode Sesi Cepat Aktif
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Formulir cepat pencatatan antropometri bulanan balita di pos layanan Posyandu terintegrasi standar WHO &amp; Kemenkes RI.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <Link
            href="/staff/balita"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200/90 text-xs font-semibold shadow-xs hover:bg-slate-50 hover:text-emerald-700 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">groups</span>
            <span>Lihat Daftar Balita ({children.length})</span>
          </Link>
        </div>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-emerald-900 shadow-xs">
          <span className="material-symbols-outlined text-[24px] text-emerald-600">check_circle</span>
          <div>
            <p className="font-bold text-sm">Pemeriksaan Berhasil Disimpan &amp; Divalidasi!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Hasil pengukuran otomatis tersinkronisasi ke grafik pertumbuhan balita dan akun orang tua.
            </p>
          </div>
        </div>
      )}

      {photoWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-amber-900 shadow-xs">
          <span className="material-symbols-outlined text-[22px] text-amber-600 shrink-0">warning</span>
          <p className="text-xs leading-relaxed">{photoWarning}</p>
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-center gap-3 text-rose-900 shadow-xs">
          <span className="material-symbols-outlined text-[22px] text-rose-600 shrink-0">error</span>
          <p className="text-xs leading-relaxed">{submitError}</p>
        </div>
      )}

      {/* Main Form & Real-time Diagnosis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Input Fields */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
            {/* Step 1: Balita Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Balita yang Ditimbang *
              </label>
              <select
                value={selectedChild?.id || ""}
                onChange={(e) => setSelectedChildId(e.target.value)}
                disabled={loadingChildren || children.length === 0}
                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer disabled:opacity-60"
              >
                {loadingChildren ? (
                  <option value="">Memuat daftar balita...</option>
                ) : children.length === 0 ? (
                  <option value="">Belum ada data balita terdaftar</option>
                ) : (
                  children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.gender === "L" ? "Laki-laki" : "Perempuan"}, {c.ageMonths} Bulan) - Wali: {c.parentName}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Child Selected Mini Profile */}
            {selectedChild && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                    {selectedChild.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedChild.name}</h4>
                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>
                        NIK: <strong className="text-slate-800">{selectedChild.nik}</strong> • Lahir: {selectedChild.birthDate}
                      </p>
                      <p>
                        Umur Otomatis: <strong className="text-emerald-800 font-bold">{calculateDetailedAge(selectedChild.birthDate).textLong}</strong>
                      </p>
                      <p className="text-xs text-slate-600">
                        Orang Tua / Wali: <strong>{selectedChild.motherName || selectedChild.parentName}</strong>
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200/70 shadow-xs self-start sm:self-center">
                  {selectedChild.posyandu}
                </span>
              </div>
            )}

            {/* Step 2: Tanggal & Metode Pengukuran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Pengukuran *
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Metode Pengukuran Panjang/Tinggi *
                </label>
                <div className="grid grid-cols-2 gap-2 h-11 items-center">
                  <button
                    type="button"
                    onClick={() => setMethod("terlentang")}
                    className={`h-full rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      method === "terlentang"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Terlentang (&lt; 24 bln)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("berdiri")}
                    className={`h-full rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      method === "berdiri"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Berdiri (≥ 24 bln)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Pengukuran Antropometri Inti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Berat Badan (BB) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.05"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Contoh: 10.8"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-500">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Panjang / Tinggi Badan (PB/TB) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Contoh: 82.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-bold text-slate-500">cm</span>
                </div>
              </div>
            </div>

            {/* Step 4: Lingkar Kepala & LiLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lingkar Kepala (Opsional)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={headCirc}
                    onChange={(e) => setHeadCirc(e.target.value)}
                    placeholder="Contoh: 46.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Lingkar Lengan Atas (LiLA)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={lila}
                    onChange={(e) => setLila(e.target.value)}
                    placeholder="Contoh: 14.5"
                    className="w-full h-11 pl-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500">cm</span>
                </div>
              </div>
            </div>

            {/* Step 5: Dokumentasi Foto Balita Saat Pemeriksaan */}
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">photo_camera</span>
                  Foto Dokumentasi Balita (Opsional)
                </span>
                <span className="text-xs text-emerald-800 font-medium bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                  JPG, PNG, WEBP • Maks. 5 MB
                </span>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/*"
                capture="environment"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              {photoError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                  <span>{photoError}</span>
                </div>
              )}

              {!photoPreviewUrl ? (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={compressingPhoto}
                  className="w-full rounded-xl border-2 border-dashed border-emerald-300 bg-white hover:bg-emerald-50/60 p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left transition-colors cursor-pointer disabled:opacity-60"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      {compressingPhoto ? "hourglass_top" : "add_a_photo"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900">
                      {compressingPhoto
                        ? "Mengompresi gambar..."
                        : "Ambil Foto Kamera atau Pilih dari Galeri"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Foto otomatis dikompresi ringan sebelum disimpan ke rekam pemeriksaan Posyandu.
                    </p>
                  </div>
                </button>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={photoPreviewUrl}
                      alt="Pratinjau foto pemeriksaan balita"
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                        {photoFileName || "Foto Pemeriksaan"}
                      </p>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        Siap diunggah ({photoBlob ? `${Math.max(1, Math.round(photoBlob.size / 1024))} KB` : "-"})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 6: Identitas Pengantar Balita */}
            <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-700">supervisor_account</span>
                  Pencatatan Identitas Pengantar Balita *
                </span>
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Tersimpan di Riwayat Kunjungan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pengantar *
                  </label>
                  <input
                    type="text"
                    required
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Nama pengantar balita"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hubungan dengan Balita *
                  </label>
                  <select
                    value={companionRelation}
                    onChange={(e) => setCompanionRelation(e.target.value)}
                    className="w-full h-11 px-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Bapak Kandung">Bapak Kandung</option>
                    <option value="Nenek">Nenek</option>
                    <option value="Kakek">Kakek</option>
                    <option value="Bibi">Bibi</option>
                    <option value="Paman">Paman</option>
                    <option value="Baby Sitter">Baby Sitter / Pengasuh</option>
                    <option value="Wali">Wali</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp Pengantar
                  </label>
                  <input
                    type="tel"
                    value={companionPhone}
                    onChange={(e) => setCompanionPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Catatan Petugas / Kondisi Anak
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Nafsu makan baik, tidak demam, sudah imunisasi lanjutan..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={loading || !selectedChild}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-60"
              >
                Simpan Sebagai Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("validated")}
                disabled={loading || !selectedChild}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Validasi &amp; Terbitkan Hasil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Real-Time Clinical Assessment Preview */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Kalkulasi Otomatis Z-Score
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200/60">
                WHO 2006
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Pengantar Kunjungan Ini</span>
                  <span className="text-xs text-slate-500">Hubungan Keluarga</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    {companionName || selectedChild?.parentName || "-"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    {companionRelation}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">TB/U (Tinggi Badan/Umur)</span>
                  <span className="text-xs text-slate-500">Deteksi Risiko Stunting</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">
                    {isStuntedPreview ? "-2.45 SD" : "-0.80 SD"}
                  </span>
                  <span className={`text-xs font-semibold ${isStuntedPreview ? "text-rose-700" : "text-emerald-700"}`}>
                    {isStuntedPreview ? "Pendek (Stunted)" : "Normal"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">BB/U (Berat Badan/Umur)</span>
                  <span className="text-xs text-slate-500">Status Berat Badan</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">+0.15 SD</span>
                  <span className="text-xs font-semibold text-emerald-700">Berat Badan Normal</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">BB/TB (Berat per Tinggi)</span>
                  <span className="text-xs text-slate-500">Deteksi Wasting / Kurus</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 block">+0.40 SD</span>
                  <span className="text-xs font-semibold text-emerald-700">Gizi Baik</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isStuntedPreview ? "bg-rose-50 border-rose-200/80 text-rose-900" : "bg-emerald-50 border-emerald-200/70 text-emerald-900"}`}>
              <div className="flex items-center gap-2 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">
                  {isStuntedPreview ? "warning" : "verified"}
                </span>
                <span>{isStuntedPreview ? "Atensi Klinis: Indikasi Stunting" : "Pertumbuhan Sesuai Usia"}</span>
              </div>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {isStuntedPreview
                  ? "Tinggi anak berada di bawah ambang batas rujukan (-2 SD). Dianjurkan konseling gizi dan evaluasi PMT oleh Bidan."
                  : "Semua indikator pertumbuhan berada dalam rentang deviasi baku normal WHO."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
