"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data kehadiran balita 12 bulan
const attendanceByYear: Record<string, Array<{ month: string; hadir: number; tidakHadir: number; persentase: number }>> = {
  "2024": [
    { month: "Jan", hadir: 118, tidakHadir: 14, persentase: 89.4 },
    { month: "Feb", hadir: 122, tidakHadir: 10, persentase: 92.4 },
    { month: "Mar", hadir: 120, tidakHadir: 12, persentase: 90.9 },
    { month: "Apr", hadir: 125, tidakHadir: 7, persentase: 94.7 },
    { month: "Mei", hadir: 124, tidakHadir: 8, persentase: 93.9 },
    { month: "Jun", hadir: 126, tidakHadir: 6, persentase: 95.5 },
    { month: "Jul", hadir: 123, tidakHadir: 9, persentase: 93.2 },
    { month: "Agu", hadir: 128, tidakHadir: 4, persentase: 97.0 },
    { month: "Sep", hadir: 125, tidakHadir: 7, persentase: 94.7 },
    { month: "Okt", hadir: 127, tidakHadir: 5, persentase: 96.2 },
    { month: "Nov", hadir: 126, tidakHadir: 6, persentase: 95.5 },
    { month: "Des", hadir: 129, tidakHadir: 3, persentase: 97.7 },
  ],
  "2023": [
    { month: "Jan", hadir: 105, tidakHadir: 20, persentase: 84.0 },
    { month: "Feb", hadir: 110, tidakHadir: 16, persentase: 87.3 },
    { month: "Mar", hadir: 112, tidakHadir: 15, persentase: 88.2 },
    { month: "Apr", hadir: 115, tidakHadir: 13, persentase: 89.8 },
    { month: "Mei", hadir: 116, tidakHadir: 12, persentase: 90.6 },
    { month: "Jun", hadir: 118, tidakHadir: 11, persentase: 91.5 },
    { month: "Jul", hadir: 117, tidakHadir: 12, persentase: 90.7 },
    { month: "Agu", hadir: 120, tidakHadir: 9, persentase: 93.0 },
    { month: "Sep", hadir: 119, tidakHadir: 10, persentase: 92.2 },
    { month: "Okt", hadir: 121, tidakHadir: 8, persentase: 93.8 },
    { month: "Nov", hadir: 122, tidakHadir: 7, persentase: 94.6 },
    { month: "Des", hadir: 123, tidakHadir: 6, persentase: 95.3 },
  ],
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const hadir = payload.find((p) => p.name === "Hadir (Ditimbang)")?.value || 0;
    const tidakHadir = payload.find((p) => p.name === "Tidak Hadir")?.value || 0;
    const total = hadir + tidakHadir;
    const rate = total > 0 ? ((hadir / total) * 100).toFixed(1) : "0";

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs min-w-[170px]">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
          Bulan {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Hadir:
            </span>
            <span className="font-bold text-white tabular-nums">{hadir} balita</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-rose-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Tidak Hadir:
            </span>
            <span className="font-bold text-white tabular-nums">{tidakHadir} balita</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-slate-300">
            <span>Tingkat Kehadiran:</span>
            <span className="font-bold text-emerald-400 tabular-nums">{rate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function AttendanceDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const data = attendanceByYear[selectedYear] || attendanceByYear["2024"];

  const totalHadir = data.reduce((acc, curr) => acc + curr.hadir, 0);
  const totalTidakHadir = data.reduce((acc, curr) => acc + curr.tidakHadir, 0);
  const avgRate = ((totalHadir / (totalHadir + totalTidakHadir)) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
      {/* Header & Filter Tahun */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              trending_up
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Rekap Kehadiran Balita ({selectedYear})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tren partisipasi penimbangan bulanan Posyandu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Tahun:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Mini KPI Ringkas */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
          <span className="text-[11px] font-semibold text-emerald-800 block">Rata-rata Hadir</span>
          <span className="font-heading text-lg font-bold text-emerald-900 tabular-nums">
            {avgRate}%
          </span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-600 block">Total Ditimbang</span>
          <span className="font-heading text-lg font-bold text-slate-900 tabular-nums">
            {totalHadir} <span className="text-[11px] font-normal text-slate-500">sesi</span>
          </span>
        </div>
        <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
          <span className="text-[11px] font-semibold text-rose-800 block">Total Absen</span>
          <span className="font-heading text-lg font-bold text-rose-900 tabular-nums">
            {totalTidakHadir} <span className="text-[11px] font-normal text-slate-500">kali</span>
          </span>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
            />
            <Line
              type="monotone"
              dataKey="hadir"
              name="Hadir (Ditimbang)"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#059669", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2, fill: "#059669" }}
            />
            <Line
              type="monotone"
              dataKey="tidakHadir"
              name="Tidak Hadir"
              stroke="#e11d48"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 3.5, stroke: "#e11d48", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 6, stroke: "#e11d48", strokeWidth: 2, fill: "#e11d48" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
