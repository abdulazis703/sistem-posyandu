"use client";

import React, { use } from "react";
import Link from "next/link";
import useChildrenData from "@/app/hooks/useChildrenData";
import { mockParents } from "@/lib/mockData";
import { StuntingBadge } from "@/components/ui/badge";
import { calculateDetailedAge } from "@/lib/ageHelper";

export default function DetailAkunOrangTuaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const parentId = resolvedParams?.id || "parent-1";

  const { children } = useChildrenData();

  const parent =
    mockParents.find((p) => p.id === parentId) || mockParents[0];

  const assignedChildren = children.filter(
    (c) => c.parentId === parent.id || c.parentName.toLowerCase().includes(parent.name.toLowerCase())
  );

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/staff/orang-tua" className="hover:text-emerald-700">Akun Orang Tua</Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">{parent.name}</span>
        </div>
        <Link
          href="/staff/orang-tua"
          className="px-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Daftar Akun</span>
        </Link>
      </div>

      {/* Parent Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-2xl flex items-center justify-center shrink-0 border border-emerald-200">
            {parent.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-heading text-xl lg:text-2xl font-bold text-slate-900">
                {parent.name}
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60">
                {parent.roleInFamily || "Ibu Kandung"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Terdaftar sejak {parent.joinDate} • Wilayah {parent.posyandu}
              {parent.spouseName && (
                <span> • Pasangan: <strong className="text-slate-800">{parent.spouseName}</strong></span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/balita/tambah"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Tetapkan Balita Baru</span>
          </Link>
        </div>
      </div>

      {/* Grid Details & Children */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Data Pribadi */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e2ebe5] shadow-sm space-y-4">
            <h3 className="font-heading text-sm font-bold text-[#0b1c30] flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
              <span className="material-symbols-outlined text-[#15803d] text-[20px]">contact_mail</span>
              Informasi Kontak & Domisili
            </h3>

            <div className="space-y-3 text-xs text-[#3f493f]">
              <div>
                <span className="text-[#6f7a6e] block text-[11px]">Nomor WhatsApp</span>
                <p className="font-bold text-[#0b1c30] mt-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#15803d]">chat</span>
                  {parent.phone}
                </p>
              </div>

              <div>
                <span className="text-[#6f7a6e] block text-[11px]">Alamat Email</span>
                <p className="font-medium text-[#0b1c30] mt-0.5">{parent.email}</p>
              </div>

              <div>
                <span className="text-[#6f7a6e] block text-[11px]">Nomor Induk Kependudukan (NIK)</span>
                <p className="font-mono font-bold text-[#0b1c30] mt-0.5">{parent.nik}</p>
              </div>

              {parent.spouseName && (
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60">
                  <span className="text-emerald-900 font-bold block text-[11px]">
                    Data Pasangan (Orang Tua Kedua)
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">{parent.spouseName}</p>
                  <p className="text-[11px] text-slate-600">
                    NIK: {parent.spouseNik || "-"} • WA: {parent.spousePhone || "-"}
                  </p>
                </div>
              )}

              <div>
                <span className="text-[#6f7a6e] block text-[11px]">Alamat Tinggal</span>
                <p className="font-medium text-[#0b1c30] mt-0.5 leading-relaxed">{parent.address}</p>
              </div>

              <div>
                <span className="text-[#6f7a6e] block text-[11px]">Posyandu Penugasan</span>
                <p className="font-bold text-[#15803d] mt-0.5">{parent.posyandu}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Balita yang Terdaftar */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#e2ebe5] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <h3 className="font-heading text-sm font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d] text-[20px]">child_care</span>
                Daftar Balita yang Ditetapkan ke Akun Ini ({assignedChildren.length})
              </h3>
            </div>

            <p className="text-xs text-[#6f7a6e]">
              Semua data balita di bawah ini otomatis tampil pada dashboard akun aplikasi orang tua tanpa proses verifikasi manual.
            </p>

            <div className="space-y-3">
              {assignedChildren.map((c) => {
                const ageDetail = calculateDetailedAge(c.birthDate);
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-4 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{c.name}</h4>
                        <p className="text-xs text-slate-500">
                          Umur Presisi: <strong className="text-emerald-800">{ageDetail.textLong}</strong> • {c.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          NIK: {c.nik} • Hubungan: <strong className="text-slate-700">Anak Kandung</strong>
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800">
                            {c.weight} kg / {c.height} cm
                          </span>
                          <StuntingBadge status={c.stuntingStatus} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/staff/balita/${c.id}`}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                      >
                        Buka Grafik
                      </Link>
                    </div>
                  </div>
                );
              })}

              {assignedChildren.length === 0 && (
                <div className="p-8 text-center text-xs text-[#6f7a6e] border border-dashed rounded-xl">
                  Belum ada balita yang ditetapkan ke akun orang tua ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
