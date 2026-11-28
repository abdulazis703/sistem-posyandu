"use client";

import React from "react";
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

// Data perbandingan distribusi status pemeriksaan (Bulan Sebelumnya vs Bulan Berjalan)
const statusComparisonData = [
  {
    status: "Normal",
    shortLabel: "Normal",
    bulanLalu: 78,
    bulanIni: 83,
    delta: +5,
    isImprovement: true,
  },
  {
    status: "Pendek (Stunted)",
    shortLabel: "Stunted",
    bulanLalu: 12,
    bulanIni: 10,
    delta: -2,
    isImprovement: true, // Berkurang stunting adalah kabar baik
  },
  {
    status: "Sangat Pendek",
    shortLabel: "Sgt Pendek",
    bulanLalu: 4,
    bulanIni: 3,
    delta: -1,
    isImprovement: true,
  },
  {
    status: "Belum Diperiksa",
    shortLabel: "Belum Ukur",
    bulanLalu: 18,
    bulanIni: 4,
    delta: -14,
    isImprovement: true, // Cakupan bertambah
  },
];

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
    const bulanLalu = payload.find((p) => p.name.includes("Bulan Lalu"))?.value ?? 0;
    const bulanIni = payload.find((p) => p.name.includes("Bulan Ini"))?.value ?? 0;
    const diff = bulanIni - bulanLalu;

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs min-w-[170px]">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2">
          Status: {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Bulan Lalu:
            </span>
            <span className="font-bold text-slate-200 tabular-nums">{bulanLalu} anak</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Bulan Ini:
            </span>
            <span className="font-bold text-white tabular-nums">{bulanIni} anak</span>
          </div>
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-slate-300">
            <span>Perubahan:</span>
            <span
              className={`font-bold tabular-nums ${
                diff > 0 ? "text-emerald-400" : diff < 0 ? "text-sky-300" : "text-slate-400"
              }`}
            >
              {diff > 0 ? `+${diff}` : diff} anak
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function StatusComparisonChart() {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              query_stats
            </span>
            <h3 className="font-heading text-base font-bold text-slate-900">
              Tren Perbandingan Status Gizi
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Komparasi garis distribusi status (Bulan Lalu vs Bulan Ini)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 text-slate-500">
            <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
            Okt (Lalu)
          </span>
          <span className="text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-0.5 bg-emerald-600 rounded-full" />
            Nov (Ini)
          </span>
        </div>
      </div>

      {/* Mini 4 Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        {statusComparisonData.map((item, idx) => (
          <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-slate-600 truncate block max-w-full">
              {item.shortLabel}
            </span>
            <div className="flex items-baseline justify-center gap-1.5 mt-0.5">
              <span className="font-heading text-base font-bold text-slate-900 tabular-nums">
                {item.bulanIni}
              </span>
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  item.delta > 0
                    ? item.status === "Normal"
                      ? "text-emerald-700"
                      : "text-rose-600"
                    : item.delta < 0
                    ? item.status === "Normal"
                      ? "text-rose-600"
                      : "text-emerald-700"
                    : "text-slate-500"
                }`}
              >
                {item.delta > 0 ? `+${item.delta}` : item.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full h-[260px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={statusComparisonData}
            margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="shortLabel"
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
              dataKey="bulanLalu"
              name="Bulan Lalu (Okt)"
              stroke="#94a3b8"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              dot={{ r: 4, stroke: "#94a3b8", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 6, stroke: "#94a3b8", strokeWidth: 2, fill: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="bulanIni"
              name="Bulan Ini (Nov)"
              stroke="#059669"
              strokeWidth={3}
              dot={{ r: 4.5, stroke: "#059669", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 6.5, stroke: "#059669", strokeWidth: 2, fill: "#059669" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
