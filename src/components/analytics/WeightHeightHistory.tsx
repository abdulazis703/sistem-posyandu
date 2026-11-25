import React from 'react'; // Assume a simple table component exists

// Mock data for 12 months
const mockHistory = [
  { month: 'Jan 2024', weight: 7.5, height: 68, weightDelta: null, heightDelta: null, nutrition: 'Normal', provider: 'Kader A' },
  { month: 'Feb 2024', weight: 7.8, height: 70, weightDelta: '+0.3', heightDelta: '+2', nutrition: 'Normal', provider: 'Kader B' },
  { month: 'Mar 2024', weight: 8.0, height: 71, weightDelta: '+0.2', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader A' },
  { month: 'Apr 2024', weight: 8.2, height: 73, weightDelta: '+0.2', heightDelta: '+2', nutrition: 'Normal', provider: 'Kader C' },
  { month: 'May 2024', weight: 8.3, height: 74, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader A' },
  { month: 'Jun 2024', weight: 8.4, height: 75, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader B' },
  { month: 'Jul 2024', weight: 8.5, height: 76, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader C' },
  { month: 'Aug 2024', weight: 8.6, height: 77, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader A' },
  { month: 'Sep 2024', weight: 8.7, height: 78, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader B' },
  { month: 'Oct 2024', weight: 8.8, height: 79, weightDelta: '+0.1', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader C' },
  { month: 'Nov 2024', weight: 9.0, height: 80, weightDelta: '+0.2', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader A' },
  { month: 'Dec 2024', weight: 9.2, height: 81, weightDelta: '+0.2', heightDelta: '+1', nutrition: 'Normal', provider: 'Kader B' },
];

export default function WeightHeightHistory() {
  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
      <h3 className="font-heading text-base font-bold text-slate-900 mb-4">
        Riwayat Penimbangan & Perkembangan Bulanan
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-4">Bulan</th>
              <th className="py-3.5 px-4">BB (kg)</th>
              <th className="py-3.5 px-4">Δ BB</th>
              <th className="py-3.5 px-4">TB (cm)</th>
              <th className="py-3.5 px-4">Δ TB</th>
              <th className="py-3.5 px-4">Status Gizi</th>
              <th className="py-3.5 px-4">Pengantar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {mockHistory.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-900">{item.month}</td>
                <td className="py-3.5 px-4">{item.weight.toFixed(1)}</td>
                <td className="py-3.5 px-4 text-emerald-700">{item.weightDelta ?? '-'} </td>
                <td className="py-3.5 px-4">{item.height}</td>
                <td className="py-3.5 px-4 text-emerald-700">{item.heightDelta ?? '-'} </td>
                <td className="py-3.5 px-4">{item.nutrition}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
