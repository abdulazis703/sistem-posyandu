"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Parent } from "@/lib/mockData";
import { getParentAccountsList } from "@/lib/supabase/dataService";

export default function AkunOrangTuaPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getParentAccountsList()
      .then((rows) => {
        if (mounted) setParents(rows);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNik, setNewNik] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPosyandu, setNewPosyandu] = useState("Posyandu Melati 01");

  const filteredParents = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddParent = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Untuk membuat akun login baru (${newParentName}), arahkan orang tua mendaftar mandiri melalui halaman /register agar terhubung langsung dengan Supabase Auth.`
    );
    setShowAddModal(false);
    setNewParentName("");
    setNewPhone("");
    setNewNik("");
    setNewAddress("");
  };

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              Akun Orang Tua &amp; Wali
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200/60">
              Terverifikasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar akun orang tua balita yang terdaftar di database Posyandu ({loading ? "..." : `${parents.length} Akun`}).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Tambah Akun Orang Tua</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan nama orang tua, email, nomor HP, atau NIK..."
          className="w-full bg-transparent text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5 align-middle whitespace-nowrap min-w-[220px]">Nama Orang Tua</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[210px]">Nomor WhatsApp &amp; Email</th>
                <th className="py-3.5 px-4 align-middle min-w-[180px]">Alamat Domisili</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[160px]">Posyandu</th>
                <th className="py-3.5 px-4 align-middle whitespace-nowrap min-w-[130px]">Jumlah Balita</th>
                <th className="py-3.5 px-5 align-middle whitespace-nowrap text-right min-w-[100px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-center text-xs text-slate-500">
                    Memuat data akun orang tua dari Supabase...
                  </td>
                </tr>
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-center text-xs text-slate-500">
                    Tidak ada akun orang tua yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                          {parent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/staff/orang-tua/${parent.id}`}
                            className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors block truncate"
                          >
                            {parent.name}
                          </Link>
                          <span className="text-xs text-slate-500 block">
                            NIK: {parent.nik}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-middle text-slate-700 whitespace-nowrap">
                      <p className="font-medium text-slate-900">{parent.phone}</p>
                      <span className="text-xs text-slate-500">{parent.email}</span>
                    </td>
                    <td className="py-3.5 px-4 align-middle text-slate-600 max-w-xs truncate text-sm">
                      {parent.address}
                    </td>
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium text-xs border border-slate-200 inline-block">
                        {parent.posyandu}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-xs border ${
                          parent.childrenCount > 0
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200/60"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">child_care</span>
                        <span>{parent.childrenCount} Balita</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5 align-middle whitespace-nowrap text-right">
                      <Link
                        href={`/staff/orang-tua/${parent.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Detail</span>
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Akun Orang Tua */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Pendaftaran Akun Orang Tua Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddParent} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Ibu / Ayah *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Melati"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK Orang Tua *</label>
                  <input
                    type="text"
                    required
                    placeholder="16 Digit NIK KTP"
                    value={newNik}
                    onChange={(e) => setNewNik(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxx"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili *</label>
                <input
                  type="text"
                  required
                  placeholder="RT / RW, Jalan, Kelurahan"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Posyandu Wilayah *</label>
                <select
                  value={newPosyandu}
                  onChange={(e) => setNewPosyandu(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Posyandu Melati 01">Posyandu Melati 01</option>
                  <option value="Posyandu Melati 02">Posyandu Melati 02</option>
                  <option value="Posyandu Melati 03">Posyandu Melati 03</option>
                  <option value="Posyandu Melati 04">Posyandu Melati 04</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Panduan Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
