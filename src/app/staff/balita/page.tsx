"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Child } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";
import useChildrenData from "@/app/hooks/useChildrenData";
import { importChildrenBulk } from "@/lib/supabase/dataService";

interface SheetJSWorksheet {
  [cell: string]: unknown;
}
interface SheetJSWorkbook {
  SheetNames: string[];
  Sheets: Record<string, SheetJSWorksheet>;
}
interface SheetJSStatic {
  read: (data: Uint8Array, opts: { type: string }) => SheetJSWorkbook;
  utils: {
    sheet_to_json: (sheet: SheetJSWorksheet, opts: { header: number }) => unknown[][];
  };
}

export default function DataBalitaPage() {
  const { children, setChildren, resetChildren, hasCustomData } = useChildrenData();
  const [search, setSearch] = useState("");
  const [selectedPosyandu, setSelectedPosyandu] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleResetData = () => {
    if (confirm("Kembalikan data ke daftar awal default? Data yang diimpor akan dihapus dan disinkronkan ke seluruh sistem.")) {
      resetChildren();
    }
  };

  const normalCount = children.filter((c) => c.stuntingStatus === "Normal").length;
  const stuntedCount = children.filter(
    (c) => c.stuntingStatus.includes("Pendek") || c.stuntingStatus.includes("Stunted")
  ).length;
  const reviewCount = children.filter((c) => c.riskFlag === "HIGH_RISK" || c.riskFlag === "MODERATE_RISK").length;
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Helper untuk memuat SheetJS secara dinamis saat file .xlsx / .xls diunggah
  const loadSheetJS = (): Promise<SheetJSStatic> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && (window as unknown as { XLSX?: SheetJSStatic }).XLSX) {
        resolve((window as unknown as { XLSX: SheetJSStatic }).XLSX);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
      script.async = true;
      script.onload = () => resolve((window as unknown as { XLSX: SheetJSStatic }).XLSX);
      script.onerror = () =>
        reject(
          new Error(
            "Gagal memuat modul pembaca Excel (.xlsx). Silakan simpan file Excel Anda sebagai CSV (.csv) lalu upload ulang."
          )
        );
      document.head.appendChild(script);
    });
  };

  // Helper untuk memparsing tanggal Bahasa Indonesia, format Excel, atau format ISO
  const parseIndonesianDate = (val: unknown): string => {
    if (!val) return "";
    let str = String(val).trim();
    if (!str || str === "." || str === "-") return "";

    // Jika format ISO YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }

    // Jika serial date dari Excel (angka murni > 20000)
    const num = Number(str);
    if (!isNaN(num) && num > 20000 && num < 60000) {
      try {
        const utcDays = Math.floor(num - 25569);
        const dateObj = new Date(utcDays * 86400 * 1000);
        return dateObj.toISOString().split("T")[0];
      } catch {
        // ignore
      }
    }

    // Normalisasi typo teks (misal: 'N0V' angka nol, '9JANUARI' tanpa spasi)
    str = str.replace(/(\d+)([a-zA-Z]+)/g, "$1 $2"); // pisahkan angka yang menempel huruf
    str = str.toUpperCase().replace(/NOV/g, "NOV");

    const monthMap: Record<string, string> = {
      JAN: "01",
      JANUARI: "01",
      FEB: "02",
      FEBRUARI: "02",
      MAR: "03",
      MARET: "03",
      APR: "04",
      APRIL: "04",
      MEI: "05",
      JUN: "06",
      JUNI: "06",
      JUL: "07",
      JULI: "07",
      AGU: "08",
      AGT: "08",
      AGUSTUS: "08",
      SEP: "09",
      SEPTEMBER: "09",
      OKT: "10",
      OKTOBER: "10",
      NOV: "11",
      NOVEMBER: "11",
      DES: "12",
      DESEMBER: "12",
    };

    // Match pola: DD MMMM YYYY (misal: "04 NOV 2021", "22 DES 2021", "6 OKTOBER 2022")
    const match = str.match(/(\d{1,2})\s+([A-Z]+)\s+(\d{4})/);
    if (match) {
      const day = match[1].padStart(2, "0");
      const monthStr = match[2];
      const year = match[3];
      const month = monthMap[monthStr];
      if (!month) return "";
      return `${year}-${month}-${day}`;
    }

    // Match pola YYYY/MM/DD atau DD/MM/YYYY
    if (str.includes("/") || str.includes("-")) {
      const parts = str.split(/[/-]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
        } else if (parts[2].length === 4) {
          return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
        }
      }
    }

    return "";
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "nama_balita,nik,jenis_kelamin,tanggal_lahir,berat_lahir_kg,tinggi_lahir_cm,nama_orang_tua,posyandu\n" +
      "Ahmad Rayhan,3515012345670103,L,2024-05-12,3.2,49.5,Siti Aminah,Posyandu Melati 01\n" +
      "Anisa Rahma,3515012345670104,P,2024-08-20,3.0,48.0,Rina Lestari,Posyandu Melati 02\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template_import_data_balita.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportStatus(null);

    const isExcelBinary = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

    try {
      let rawRows: unknown[][] = [];

      if (isExcelBinary) {
        // Parsing file biner Excel (.xlsx / .xls) menggunakan SheetJS
        const XLSX = await loadSheetJS();
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
      } else {
        // Parsing file teks CSV
        const text = await file.text();
        if (text.startsWith("PK\x03\x04") || text.slice(0, 4) === "PK\x03\x04") {
          throw new Error(
            "File ini adalah file Excel biner (.xlsx) yang diubah namanya menjadi .csv. Harap simpan melalui menu Save As di Excel sebagai format CSV."
          );
        }

        const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
        const delimiter = lines[0].includes(";") ? ";" : ",";
        rawRows = lines.map((line) =>
          line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ""))
        );
      }

      if (!rawRows || rawRows.length <= 1) {
        throw new Error("File tidak memiliki baris data atau kosong.");
      }

      // Deteksi Judul Posyandu dari baris atas
      let detectedPosyandu = "Posyandu Berlian Ceria";
      for (let i = 0; i < Math.min(3, rawRows.length); i++) {
        const topText = (rawRows[i] || []).join(" ").trim();
        if (topText.toUpperCase().includes("POSYANDU")) {
          detectedPosyandu = topText.replace(/[,;]/g, " ").trim();
          break;
        }
      }

      // Deteksi Baris Header Kolom & Posisi Indeks
      let headerRowIdx = -1;
      let nameIdx = 1;
      let nikIdx = 2;
      let genderIdx = 3;
      let birthDateIdx = 4;
      let addressIdx = 5;
      let weightIdx = -1;
      let heightIdx = -1;

      // Scan 10 baris pertama untuk mencari baris header
      for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
        const rowStr = (rawRows[r] || []).map((c) => String(c).toUpperCase()).join(" ");
        if (rowStr.includes("NAMA") || rowStr.includes("BALITA")) {
          headerRowIdx = r;
          const headerRow = rawRows[r];
          for (let c = 0; c < headerRow.length; c++) {
            const h = String(headerRow[c] || "").toUpperCase().replace(/\s+/g, " ");
            if (h.includes("NAMA")) nameIdx = c;
            else if (h.includes("NIK") || h.includes("N I K")) nikIdx = c;
            else if (h.includes("L / P") || h === "JK" || h.includes("JENIS")) genderIdx = c;
            else if (h.includes("LAHIR") || h.includes("TANGGAL")) birthDateIdx = c;
            else if (h.includes("ALAMAT") || h.includes("RT")) addressIdx = c;
            else if (h.includes("BERAT") || h.includes("BB")) weightIdx = c;
            else if (h.includes("TINGGI") || h.includes("TB")) heightIdx = c;
          }
          break;
        }
      }

      // Cek apakah ada subheader di baris berikutnya (misal: UMUR, BERAT BADAN, TINGGI BADAN)
      if (headerRowIdx !== -1 && headerRowIdx + 1 < rawRows.length) {
        const subHeaderRow = rawRows[headerRowIdx + 1];
        for (let c = 0; c < subHeaderRow.length; c++) {
          const sh = String(subHeaderRow[c] || "").toUpperCase();
          if ((sh.includes("BERAT") || sh === "BB") && weightIdx === -1) weightIdx = c;
          if ((sh.includes("TINGGI") || sh === "TB") && heightIdx === -1) heightIdx = c;
        }
      }

      // Default fallback jika weight & height di kolom 7 & 8 (format buku Posyandu)
      if (weightIdx === -1) weightIdx = 7;
      if (heightIdx === -1) heightIdx = 8;

      const startDataRow = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
      const newChildren: Child[] = [];
      const skippedRows: string[] = [];

      for (let i = startDataRow; i < rawRows.length; i++) {
        const row = rawRows[i];
        if (!row || row.length === 0) continue;

        let name = String(row[nameIdx] || "").trim();

        // Bersihkan tanda koma di awal/akhir nama (misal "M,HAFIZH" -> "M. HAFIZH")
        name = name.replace(/^[,;]+|[,;]+$/g, "").replace(/,([A-Z])/g, ". $1");

        // Lewati jika nama kosong, hanya nomor, atau baris subheader/penutup
        if (
          !name ||
          name.length < 2 ||
          name.toUpperCase().includes("NAMA BALITA") ||
          name.toUpperCase().includes("UMUR") ||
          name.toUpperCase().includes("BERAT BADAN") ||
          /^\d+$/.test(name)
        ) {
          continue;
        }

        // Tanggal Lahir (dibaca lebih dulu karena dipakai untuk kunci cadangan NIK)
        const birthDate = parseIndonesianDate(row[birthDateIdx]);
        if (!birthDate) {
          skippedRows.push(`${name} (baris ${i + 1})`);
          continue;
        }

        // NIK (bila kosong, berikan kode registrasi unik)
        let nik = String(row[nikIdx] || "").replace(/[^0-9]/g, "");
        if (!nik || nik.length < 10) {
          nik = `REG-${name.replace(/\W+/g, "").toUpperCase()}-${birthDate}`;
        }

        // Jenis Kelamin
        const rawGender = String(row[genderIdx] || "").trim().toUpperCase();
        const gender: "L" | "P" = rawGender.startsWith("P") ? "P" : "L";

        // Alamat / Orang Tua
        const address = addressIdx !== -1 ? String(row[addressIdx] || "").trim() : "";
        const parentName = address ? `Wali (${address})` : "Orang Tua";

        // Berat Badan & Tinggi Badan
        const rawWeightStr = weightIdx !== -1 ? String(row[weightIdx] || "") : "";
        const rawHeightStr = heightIdx !== -1 ? String(row[heightIdx] || "") : "";
        const cleanWeight = parseFloat(rawWeightStr.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
        const cleanHeight = parseFloat(rawHeightStr.replace(/[^0-9.,]/g, "").replace(",", ".")) || 0;
        const hasMeasurement = cleanWeight > 0 && cleanHeight > 0;

        // Hitung Usia Bulan
        const birthYear = new Date(birthDate).getFullYear() || 2022;
        const birthMonth = new Date(birthDate).getMonth() || 0;
        const now = new Date();
        const ageMonths = Math.max(1, (now.getFullYear() - birthYear) * 12 + (now.getMonth() - birthMonth));

        // Evaluasi Indikasi Stunting Sederhana
        let stuntingStatus: "Normal" | "Pendek (Stunted)" | "Sangat Pendek" | "Tinggi" = "Normal";
        const wastingStatus: "Gizi Baik (Normal)" | "Gizi Kurang" | "Gizi Buruk" | "Berisiko Gizi Lebih" = "Gizi Baik (Normal)";
        let riskFlag: "NORMAL" | "NOTICE" | "MODERATE_RISK" | "HIGH_RISK" | "CRITICAL" = "NORMAL";

        if (hasMeasurement && ageMonths >= 24 && cleanHeight < 76) {
          stuntingStatus = "Sangat Pendek";
          riskFlag = "HIGH_RISK";
        } else if (hasMeasurement && ageMonths >= 24 && cleanHeight < 80) {
          stuntingStatus = "Pendek (Stunted)";
          riskFlag = "MODERATE_RISK";
        }

        newChildren.push({
          id: `child-${nik}`,
          name,
          nik,
          gender,
          birthDate,
          ageMonths,
          parentName,
          parentId: `parent-posyandu-${i}`,
          posyandu: detectedPosyandu,
          posyanduId: "11111111-1111-1111-1111-111111111111",
          lastExamDate: hasMeasurement ? new Date().toISOString().split("T")[0] : "",
          weight: cleanWeight,
          height: cleanHeight,
          zScoreTbU: !hasMeasurement ? 0 : stuntingStatus === "Normal" ? 0.2 : stuntingStatus === "Sangat Pendek" ? -3.2 : -2.4,
          zScoreBbU: 0.1,
          zScoreBbTb: 0.1,
          stuntingStatus,
          wastingStatus,
          riskFlag,
        });
      }

      if (newChildren.length === 0) {
        throw new Error(
          "Tidak ada data balita yang valid terbaca. Pastikan baris data memiliki nama balita."
        );
      }

      // Masukkan seluruh anak hasil import ke urutan paling atas tabel & simpan persisten
      const result = await importChildrenBulk(newChildren);
      await reload();

      setImportStatus({
        type: "success",
        message:
          `Berhasil menyimpan ${result.inserted} balita dari ${detectedPosyandu}.` +
          (result.skippedDuplicates > 0
            ? ` ${result.skippedDuplicates} data dilewati karena sudah ada.`
            : "") +
          (skippedRows.length > 0
            ? ` ${skippedRows.length} baris dilewati karena tanggal lahir tidak terbaca: ${skippedRows.slice(0, 3).join(", ")}${skippedRows.length > 3 ? ", ..." : ""}.`
            : "") +
          (result.warnings.length > 0 ? ` Peringatan: ${result.warnings[0]}` : ""),
      });

      setTimeout(() => {
        setIsImportOpen(false);
        setImportStatus(null);
      }, 1600);
    } catch (err: unknown) {
      setImportStatus({
        type: "error",
        message:
          (err instanceof Error ? err.message : null) ||
          "Format file tidak valid. Pastikan file berformat CSV / Excel sesuai template.",
      });
    } finally {
      setImportLoading(false);
      e.target.value = "";
    }
  };

  const filteredChildren = children.filter((child) => {
    const matchSearch =
      child.name.toLowerCase().includes(search.toLowerCase()) ||
      child.nik.includes(search) ||
      child.parentName.toLowerCase().includes(search.toLowerCase());

    const matchPosyandu =
      selectedPosyandu === "all" || child.posyandu === selectedPosyandu;

    const matchStatus =
      selectedStatus === "all" ||
      (selectedStatus === "normal" && child.stuntingStatus === "Normal") ||
      (selectedStatus === "stunted" && child.stuntingStatus.includes("Pendek"));

    return matchSearch && matchPosyandu && matchStatus;
  });

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header Area */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Data Balita
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              KMS & e-PPGBM Terintegrasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Kelola data registrasi balita, status gizi tumbuh kembang, dan penugasan akun orang tua wilayah binaan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {hasCustomData && (
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all border border-slate-200 cursor-pointer"
              title="Reset data ke default"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Data</span>
            </button>
          )}
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-all border border-emerald-200/80 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-700">upload_file</span>
            <span>Import Excel / CSV</span>
          </button>
          <button
            onClick={() => alert("Mengekspor data seluruh balita ke Excel/CSV...")}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-slate-700 hover:text-emerald-700 text-xs font-semibold hover:bg-slate-50 transition-all border border-slate-200/90 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
            <span>Ekspor Data</span>
          </button>
          <Link
            href="/staff/balita/tambah"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Tambah Balita</span>
          </Link>
        </div>
      </header>

      {/* Top Summary Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Total Balita Terdaftar</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-slate-900">{children.length}</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">verified</span> Data Tersimpan
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">child_care</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Status Gizi Normal</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-emerald-700">{normalCount}</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1">
              {children.length > 0 ? Math.round((normalCount / children.length) * 100) : 0}% dari total balita
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Risiko Stunting (TB/U)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-amber-700">{stuntedCount}</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-amber-700 font-medium mt-1">Dalam pemantauan aktif</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Perlu Tinjauan Gizi</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-heading text-3xl lg:text-4xl font-extrabold text-rose-700">{reviewCount}</span>
              <span className="text-xs text-slate-500 font-medium">Anak</span>
            </div>
            <span className="text-xs text-rose-700 font-medium mt-1">Prioritas Intervensi</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari balita berdasarkan nama, NIK, atau nama orang tua..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedPosyandu}
            onChange={(e) => setSelectedPosyandu(e.target.value)}
            className="text-xs sm:text-sm py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Posyandu</option>
            <option value="Posyandu Melati 01">Posyandu Melati 01</option>
            <option value="Posyandu Melati 02">Posyandu Melati 02</option>
            <option value="Posyandu Melati 03">Posyandu Melati 03</option>
            <option value="Posyandu Melati 04">Posyandu Melati 04</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs sm:text-sm py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Status Gizi</option>
            <option value="normal">Gizi Normal</option>
            <option value="stunted">Risiko Stunted / Pendek</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Nama Balita</th>
                <th className="py-3.5 px-4">NIK & Gender</th>
                <th className="py-3.5 px-4">Usia</th>
                <th className="py-3.5 px-4">Orang Tua / Wali</th>
                <th className="py-3.5 px-4">Posyandu</th>
                <th className="py-3.5 px-4">BB / TB Terakhir</th>
                <th className="py-3.5 px-4">Status Stunting (TB/U)</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {child.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/staff/balita/${child.id}`}
                          className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors block"
                        >
                          {child.name}
                        </Link>
                        <span className="text-xs text-slate-500">
                          Lahir: {child.birthDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-mono text-xs">{child.nik}</p>
                    <span className="text-xs text-slate-500">
                      {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {child.ageMonths} Bulan
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <p className="font-medium text-slate-800">{child.parentName}</p>
                    <span className="text-xs text-emerald-700 font-medium">Terhubung Otomatis</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {child.posyandu}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{child.weight} kg</span> /{" "}
                    <span className="font-semibold text-slate-900">{child.height} cm</span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {child.lastExamDate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StuntingBadge status={child.stuntingStatus} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/staff/balita/${child.id}`}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Lihat Detail Balita"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <Link
                        href="/staff/pemeriksaan"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        title="Catat Pemeriksaan Balita Ini"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_chart</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Import Data Balita */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Import Data Balita Massal</h3>
                  <p className="text-xs text-slate-500">Unggah file spreadsheet Excel (.xlsx) atau CSV</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-5 space-y-4">
              {/* Petunjuk Format */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Format Kolom yang Diperlukan:</span>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    Unduh Format Template
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kolom wajib: <code className="bg-white px-1 py-0.5 rounded border text-[10px]">nama_balita</code>, <code className="bg-white px-1 py-0.5 rounded border text-[10px]">nik</code>, <code className="bg-white px-1 py-0.5 rounded border text-[10px]">jenis_kelamin (L/P)</code>, <code className="bg-white px-1 py-0.5 rounded border text-[10px]">tanggal_lahir (YYYY-MM-DD)</code>, berat_lahir_kg, tinggi_lahir_cm, nama_orang_tua, posyandu.
                </p>
              </div>

              {/* Status Message */}
              {importStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${importStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {importStatus.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span>{importStatus.message}</span>
                </div>
              )}

              {/* File Dropzone */}
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls, text/csv"
                  onChange={handleFileChange}
                  disabled={importLoading}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">
                    {importLoading ? "hourglass_top" : "cloud_upload"}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-800">
                    {importLoading ? "Sedang memproses file..." : "Klik untuk memilih file Excel / CSV"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mendukung format .csv atau .xlsx (Maks. 5 MB)</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
