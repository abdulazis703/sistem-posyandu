"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#15803d] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[24px]">eco</span>
          </div>
          <span className="font-heading text-2xl font-bold text-[#00652c]">
            TumbuhKu
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e2ebe5]">
          <div className="mb-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#00652c] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[26px]">lock_reset</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#0b1c30]">
              Atur Ulang Kata Sandi
            </h2>
            <p className="text-xs text-[#3f493f] mt-1.5 leading-relaxed">
              Masukkan nomor WhatsApp atau email yang terdaftar untuk menerima tautan pemulihan kata sandi.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#dcfce7] rounded-xl border border-[#86efac] text-center space-y-2">
                <span className="material-symbols-outlined text-[#15803d] text-[28px]">
                  mark_email_read
                </span>
                <p className="text-xs text-[#166534] font-semibold">
                  Tautan Pemulihan Berhasil Dikirim!
                </p>
                <p className="text-[11px] text-[#347047]">
                  Silakan periksa pesan WhatsApp atau inbox email di <strong>{identifier}</strong> untuk mengatur kata sandi baru.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full h-11 bg-[#15803d] hover:bg-[#14532d] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0b1c30] mb-1.5">
                  Nomor WhatsApp atau Email
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#6f7a6e]">
                    contact_mail
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="081234567890 atau email@anda.com"
                    className="w-full h-11 pl-10 pr-4 bg-white border border-[#cbd5e1] rounded-xl text-xs text-[#0b1c30] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#15803d] hover:bg-[#14532d] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#15803d]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Kirim Tautan Pemulihan</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#00652c] hover:underline inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Kembali ke Masuk
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

