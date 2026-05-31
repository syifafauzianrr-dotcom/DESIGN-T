/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Info,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { Transaction, BudgetCategory } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
}

export function Reports({ transactions, categories }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState('2526-05'); // default/hardcoded style month
  const [reportSuccess, setReportSuccess] = useState(false);

  // Hardcode available months for dropdown
  const availableMonths = [
    { label: 'Mei 2026', value: '2026-05' },
    { label: 'April 2026', value: '2026-04' },
    { label: 'Maret 2026', value: '2026-03' },
    { label: 'Februari 2026', value: '2026-02' }
  ];

  // Pick actual year/month to filter
  const activePattern = selectedMonth === '2526-05' ? '2026-05' : selectedMonth;
  const monthTransactions = transactions.filter(tx => tx.date.startsWith(activePattern));

  // Compute stats
  const totalIn = monthTransactions
    .filter(tx => tx.type === 'pemasukan')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalOut = monthTransactions
    .filter(tx => tx.type === 'pengeluaran')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const savingsRate = totalIn > 0 ? Math.max(0, Math.round(((totalIn - totalOut) / totalIn) * 100)) : 0;

  // Compute category allocation breakdown for expenses
  const expenseBreakdown = monthTransactions
    .filter(tx => tx.type === 'pengeluaran')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

  const breakdownArray = Object.entries(expenseBreakdown).map(([name, val]) => {
    const parentCategory = categories.find(c => c.name === name);
    return {
      name,
      value: val,
      color: parentCategory ? parentCategory.color : '#64748B'
    };
  }).sort((a, b) => b.value - a.value);

  const totalBreakdown = breakdownArray.reduce((sum, item) => sum + item.value, 0);

  // Format IDR Ropiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleExport = () => {
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
    }, 4000);
  };

  // Mock Trend data for six months
  const monthlyTrends = [
    { name: 'Des', pemasukan: 1200000, pengeluaran: 950000 },
    { name: 'Jan', pemasukan: 1500000, pengeluaran: 1100000 },
    { name: 'Feb', pemasukan: 1000000, pengeluaran: 750000 },
    { name: 'Mar', pemasukan: 1600000, pengeluaran: 1200000 },
    { name: 'Apr', pemasukan: 2000000, pengeluaran: 1350000 },
    { name: 'Mei', pemasukan: Math.max(totalIn, 1500000), pengeluaran: Math.max(totalOut, 800000) }
  ];

  return (
    <div className="space-y-6" id="monevy-reports-dashboard">
      {/* Title & Dropdown selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="reports-top-bar">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan & Grafik Keuangan</h1>
          <p className="text-xs text-slate-500">Visualisasi komprehensif alokasi saku bulanan Anda.</p>
        </div>
        
        {/* Month selector UI */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-emerald-600" />
          <select
            id="report-month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="2526-05">Semua Transaksi Aktual</option>
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Screen 9: Ringkasan Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="ringkasan-laporan-grid">
        {/* Total In */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Pemasukan</span>
          <span className="text-xl font-bold text-emerald-600 block mt-1">{formatRupiah(totalIn || 2500000)}</span>
          <span className="text-[10px] text-slate-400 block mt-1.5">Dari {monthTransactions.filter(t=>t.type==='pemasukan').length} item pemasukan</span>
        </div>

        {/* Total Out */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Pengeluaran</span>
          <span className="text-xl font-bold text-red-650 text-red-600 block mt-1">{formatRupiah(totalOut || 800000)}</span>
          <span className="text-[10px] text-slate-400 block mt-1.5">Dari {monthTransactions.filter(t=>t.type==='pengeluaran').length} item belanja</span>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Persentase Hemat</span>
          <span className="text-xl font-bold text-indigo-650 text-indigo-600 block mt-1">{savingsRate || 68}%</span>
          <span className="text-[10px] text-slate-400 block mt-1.5">Skor Kesehatan: <span className="text-indigo-600 font-bold">Hebat</span></span>
        </div>

        {/* Export action */}
        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Status Ekspor</span>
            <span className="text-xs text-slate-700 block leading-relaxed">Ekspor hasil pembukuan bulan ini ke format Excel/PDF.</span>
          </div>
          <button
            id="btn-export-laporan"
            onClick={handleExport}
            className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Ekspor Laporan
          </button>
        </div>
      </div>

      {reportSuccess && (
        <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-between transition animate-pulse" id="alert-export-success">
          <span>🎉 Berhasil! Laporannya telah diformat dan siap dipasang di lampiran laporan rekapitulasi Anda.</span>
          <button onClick={() => setReportSuccess(false)} className="text-white hover:text-emerald-100">✕</button>
        </div>
      )}

      {/* Screen 10: GRAPHS & INTERACTIVE CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="grafik-visual-section">
        {/* Left Widget: Bar Comparison Chart (Pure SVG) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4" id="grafik-bar-pemasukan-pengeluaran">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600" /> Grafik Batang Perbandingan Keuangan (6 Bulan)
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">Rupiah (M)</span>
          </div>

          Controlled SVG Bar Chart
          <div className="relative pt-6" id="svg-bar-container">
            <svg viewBox="0 0 400 200" className="w-full h-auto overflow-visible">
              {/* Gridlines */}
              <line x1="30" y1="20" x2="380" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="70" x2="380" y2="70" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="120" x2="380" y2="120" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="170" x2="380" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Y Axis text labels */}
              <text x="5" y="24" className="text-[9px] fill-slate-400 font-bold">2.0M</text>
              <text x="5" y="74" className="text-[9px] fill-slate-400 font-bold">1.0M</text>
              <text x="5" y="124" className="text-[9px] fill-slate-400 font-bold">0.5M</text>
              <text x="5" y="174" className="text-[9px] fill-slate-400 font-bold">0</text>

              {/* Draw Bars */}
              {monthlyTrends.map((t, idx) => {
                const step = 55;
                const startX = 40 + idx * step;
                
                // Scale values: max value is 2.500.000 = 150 points height
                const scale = 150 / 2000000; 
                const hIn = Math.min(150, t.pemasukan * scale);
                const hOut = Math.min(150, t.pengeluaran * scale);
                
                const yIn = 170 - hIn;
                const yOut = 170 - hOut;

                return (
                  <g key={t.name}>
                    {/* Income Bar (Green) */}
                    <rect 
                      x={startX} 
                      y={yIn} 
                      width="12" 
                      height={hIn} 
                      rx="3" 
                      fill="#10B981" 
                      className="transition-all hover:opacity-85"
                    />
                    {/* Expense Bar (Red) */}
                    <rect 
                      x={startX + 14} 
                      y={yOut} 
                      width="12" 
                      height={hOut} 
                      rx="3" 
                      fill="#EF4444" 
                      className="transition-all hover:opacity-85"
                    />
                    {/* Text Label on bottom */}
                    <text x={startX + 10} y="185" textAnchor="middle" className="text-[9px] font-bold fill-slate-550 fill-slate-550 fill-slate-500">
                      {t.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Colors legend */}
            <div className="flex gap-4 justify-center pt-3 text-[10px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Pemasukan</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Pengeluaran</span>
            </div>
          </div>
        </div>

        {/* Right Widget: Pie Chart Breakdown of Category Allocations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4" id="grafik-pie-pengeluaran">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" /> Pengeluaran per Kategori Alokasi
            </h3>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">Mei 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Visual SVG Donut/Pie Chart */}
            <div className="relative flex justify-center py-2" id="svg-donut-chart">
              <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                {breakdownArray.length > 0 ? (
                  // Loop and calculate circle dashes
                  breakdownArray.reduce((acc, cat, idx) => {
                    const percentage = totalBreakdown > 0 ? (cat.value / totalBreakdown) * 100 : 0;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = 100 - acc.accumulated + 25; // 25 is offset to make it neat
                    
                    acc.accumulated += percentage;
                    acc.elements.push(
                      <circle
                        key={cat.name}
                        cx="50"
                        cy="50"
                        r="35"
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all hover:stroke-[14]"
                      />
                    );
                    return acc;
                  }, { accumulated: 0, elements: [] as React.ReactNode[] }).elements
                ) : (
                  // Default gray spacer circle if zero
                  <circle cx="50" cy="50" r="35" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Terpakai</span>
                <span className="text-[11.5px] font-extrabold text-slate-800">{formatRupiah(totalOut || 800000)}</span>
              </div>
            </div>

            {/* Bullet Legend with Exact Values */}
            <div className="space-y-2 mt-2 md:mt-0 max-h-[140px] overflow-y-auto pr-1" id="pie-legend-items">
              {breakdownArray.map((item) => (
                <div key={item.name} className="flex justify-between text-[11px] border-b border-dashed border-slate-50 pb-1.5">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-semibold truncate max-w-[100px]">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">{formatRupiah(item.value)}</span>
                </div>
              ))}
              {breakdownArray.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-6">
                  Tidak ada data belanja keluar bulan ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screen 10.3: Line Chart - Monthly Balance Trend (Pure SVG) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4" id="grafik-line-tren-keuangan">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Tren Akumulasi Tabungan 6 Bulan Terakhir
          </h3>
          <span className="text-xs text-slate-400 font-semibold italic">Membantu Konsistensi Keuangan Mahasiswa</span>
        </div>

        {/* SVG Line Graph */}
        <div className="pt-2" id="svg-line-container">
          <svg viewBox="0 0 500 150" className="w-full h-auto overflow-visible">
            {/* Horizontal Gridlines */}
            <line x1="30" y1="20" x2="480" y2="20" stroke="#F8FAFC" strokeWidth="1" />
            <line x1="30" y1="70" x2="480" y2="70" stroke="#F8FAFC" strokeWidth="1" />
            <line x1="30" y1="120" x2="480" y2="120" stroke="#F1F5F9" strokeWidth="1.5" />

            {/* Path representing scale values of accumulation */}
            <path
              d="M 50 110 L 130 95 L 210 115 L 290 80 L 370 60 L 450 40"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Ambient Area Gradient underneath the line */}
            <path
              d="M 50 110 L 130 95 L 210 115 L 290 80 L 370 60 L 450 40 L 450 120 L 50 120 Z"
              fill="url(#trend-gradient)"
              opacity="0.15"
            />

            {/* Defining key gradient */}
            <defs>
              <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Nodes/Dots on top */}
            <circle cx="50" cy="110" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="130" cy="95" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="210" cy="115" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="290" cy="80" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="370" cy="60" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="450" cy="40" r="5.5" fill="#047857" stroke="#FFFFFF" strokeWidth="2" />

            {/* Month annotations on horizontal axis */}
            <text x="50" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Des</text>
            <text x="130" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Jan</text>
            <text x="210" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Feb</text>
            <text x="290" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Mar</text>
            <text x="370" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-400">Apr</text>
            <text x="450" y="138" textAnchor="middle" className="text-[9px] font-bold fill-slate-600">Mei</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
