/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  MinusCircle, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Award,
  Wallet,
  Target,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { Transaction, BudgetCategory, SavingTarget } from '../types';

interface DashboardProps {
  saldoTotal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  recentTransactions: Transaction[];
  categories: BudgetCategory[];
  targets: SavingTarget[];
  onNavigate: (tab: string) => void;
  onOpenQuickTx: (type: 'pemasukan' | 'pengeluaran') => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export function Dashboard({
  saldoTotal,
  totalPemasukan,
  totalPengeluaran,
  recentTransactions,
  categories,
  targets,
  onNavigate,
  onOpenQuickTx,
  onSelectTransaction
}: DashboardProps) {
  // Get today's date in Indonesian format
  const dateFormatted = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format to IDR rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6" id="monevy-dashboard-root">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white/5 backdrop-blur-2xl rounded-3xl p-6 md:p-8 text-white border border-white/10 shadow-2xl overflow-hidden relative" id="dashboard-welcome-banner">
        {/* Decorative blur elements inside card */}
        <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-emerald-500/20 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute bottom-0 left-[30%] w-[180px] h-[180px] bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />

        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8 z-0">
          <Award className="w-48 h-48 text-indigo-400 rotate-12" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md border border-white/10 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Pencatatan Keuangan Terintegrasi
          </div>
          <h1 className="text-2xl md:text-3.5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Halo, John Doe! 👋</h1>
          <p className="text-slate-300 text-sm max-w-md">
            Monevy siap membantu Anda mengelola dana saku bulanan dengan disiplin, memantau tugas kuliah, dan mengatur jadwal praktis.
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 md:w-64 relative z-10" id="quick-savings-mini">
          <span className="text-xs text-slate-300 block">Kemajuan Menabung Bulan Ini</span>
          <span className="text-lg font-bold block mt-0.5 text-emerald-450 text-emerald-400">Rp 120.000 / Rp 250.000</span>
          <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: '48%' }} />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 text-right">48% Tercapai</span>
        </div>
      </div>

      {/* Main Budget Hub Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="dashboard-metric-cards">
        {/* Card 1: Saldo Utama */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl transition hover:border-white/20 hover:bg-white/10 relative overflow-hidden" id="card-saldo-utama">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-450 text-slate-400 uppercase tracking-wider block">Saldo Total</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-white tracking-tight mt-1.5">
                {formatRupiah(saldoTotal)}
              </h2>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Uang Cukup s/d Akhir Bulan</span>
            <span className="bg-emerald-500/20 text-emerald-350 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">Terkendali</span>
          </div>
        </div>

        {/* Card 2: Pengeluaran */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl transition hover:border-white/20 hover:bg-white/10" id="card-total-pengeluaran">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-450 text-slate-400 uppercase tracking-wider block">Total Pengeluaran</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-rose-400 tracking-tight mt-1.5">
                {formatRupiah(totalPengeluaran)}
              </h2>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-450 text-rose-400 shadow-lg shadow-rose-500/10">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Batas Pengeluaran Dianjurkan</span>
            <span className="text-rose-400 font-bold">Maks Rp 1.2M</span>
          </div>
        </div>

        {/* Card 3: Pemasukan */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl transition hover:border-white/20 hover:bg-white/10" id="card-total-pemasukan">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-450 text-slate-400 uppercase tracking-wider block">Total Pemasukan</span>
              <h2 className="text-2xl md:text-3.5xl font-bold text-emerald-400 tracking-tight mt-1.5">
                {formatRupiah(totalPemasukan)}
              </h2>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Rasio Pemasukan vs Pengeluaran</span>
            <span className="text-emerald-400 font-bold">Rasio: 3.1x</span>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-5 border border-white/10 flex flex-wrap gap-4 items-center justify-between shadow-xl" id="quick-action-hub">
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-white">Aksi Cepat Monevy</span>
          <p className="text-xs text-slate-400 font-medium">Catat keuangan harian atau kelola tugas dengan satu ketukan</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            id="btn-quick-pemasukan"
            onClick={() => onOpenQuickTx('pemasukan')}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-650 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-500/10 transition transform active:scale-95 cursor-pointer border border-white/10"
          >
            <PlusCircle className="w-4 h-4" /> Tambah Pemasukan
          </button>
          <button
            id="btn-quick-pengeluaran"
            onClick={() => onOpenQuickTx('pengeluaran')}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-650 text-white rounded-2xl text-xs font-bold shadow-lg shadow-red-500/10 transition transform active:scale-95 cursor-pointer border border-white/10"
          >
            <MinusCircle className="w-4 h-4" /> Tambah Pengeluaran
          </button>
        </div>
      </div>

      {/* Grid: Financial & Academic Companion Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-two-column-layout">
        {/* Left Column: Recent Transactions */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4" id="recent-transactions-widget">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Aktivitas & Riwayat Transaksi</h3>
            <button 
              id="view-all-transactions"
              onClick={() => onNavigate('transaksi')} 
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.slice(0, 4).map((tx) => (
              <div 
                id={`tx-row-${tx.id}`}
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl transition cursor-pointer border border-white/5 hover:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${tx.type === 'pemasukan' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
                    {tx.type === 'pemasukan' ? <TrendingUp className="w-4.5 h-4.5" /> : <TrendingDown className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{tx.title}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{tx.category} • {tx.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-extrabold text-sm ${tx.type === 'pemasukan' ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                  {tx.catatan && (
                    <span className="text-[10px] text-slate-400 block mt-0.5 max-w-[120px] truncate">{tx.catatan}</span>
                  )}
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-slate-400" id="no-tx-placeholder">
                Belum ada transaksi terekam. Ketuk tombol di atas untuk mencatat pengeluaran pertama Anda.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Budget Monitoring & Saving Targets (Core Financials) */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-6" id="financial-summary-widget">
          {/* Category Budget Limits Warning & Progress (Screen 6 / Screen 13) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white">Batas Anggaran Bulanan</h3>
                <p className="text-[10px] text-slate-400 font-medium">Berdasarkan alokasi saku bulanan dan pengeluaran</p>
              </div>
              <button 
                id="view-category-budgets"
                onClick={() => onNavigate('transaksi')} 
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
              >
                Kelola Dana <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {categories
                .filter(cat => cat.type === 'pengeluaran' && cat.budgetLimit)
                .map((cat) => {
                  const spent = recentTransactions
                    .filter(tx => tx.type === 'pengeluaran' && tx.category === cat.name)
                    .reduce((sum, tx) => sum + tx.amount, 0);
                  const limit = cat.budgetLimit || 1;
                  const percent = Math.min(100, Math.round((spent / limit) * 100));
                  const isNearLimit = percent >= 85;

                  return (
                    <div id={`dashboard-cat-progress-${cat.id}`} key={cat.id} className="space-y-1.5 p-3.5 bg-white/5 rounded-2.5xl border border-white/10 hover:bg-white/10 transition">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full block animate-pulse" 
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-bold text-white">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-350 text-slate-400 text-[11px]">
                            {formatRupiah(spent)} / {formatRupiah(limit)}
                          </span>
                          {isNearLimit && (
                            <span 
                              className="bg-red-500/20 text-red-200 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                              title="Waspada: Hampir Melampaui Batas!"
                            >
                              <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" /> {percent}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 100 ? 'bg-rose-500 shadow-md shadow-rose-550/20' : percent >= 80 ? 'bg-amber-500 shadow-md shadow-amber-550/20' : 'bg-emerald-500 shadow-md shadow-emerald-550/20'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-bold">
                        <span className="text-slate-400 font-medium">Tersisa {formatRupiah(Math.max(0, limit - spent))}</span>
                        <span className={percent >= 100 ? 'text-rose-450 text-rose-400' : percent >= 80 ? 'text-amber-400' : 'text-emerald-400'}>
                          {percent}% Terpakai
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Savings targets progress mini widget (Screen 11 / Screen 3 mini savings) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4.5 h-4.5 text-indigo-400" /> Alokasi Tabungan Prioritas
                </h3>
                <p className="text-[10px] text-slate-405 text-slate-400 font-medium">Buku, Laptop baru, kontrakan, & dana siaga</p>
              </div>
              <button 
                id="view-all-savings-targets"
                onClick={() => onNavigate('tabungan')} 
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
              >
                Ambil Rencana <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {targets.slice(0, 2).map((target) => {
                const percent = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100));
                
                return (
                  <div key={target.id} className="p-3.5 bg-white/5 border border-white/10 rounded-2.5xl hover:bg-white/10 transition flex flex-col justify-between gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-455 text-indigo-400 border border-indigo-500/20 rounded-lg">
                          <Coins className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs block">{target.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                            Target: {formatRupiah(target.targetAmount)}
                          </span>
                        </div>
                      </div>
                      <span className="text-indigo-400 font-extrabold text-xs">{percent}%</span>
                    </div>

                    {/* Progress bar info */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-505 from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-405 text-slate-400">
                      <span>Terkumpul {formatRupiah(target.currentAmount)}</span>
                      <span>Kekurangan {formatRupiah(Math.max(0, target.targetAmount - target.currentAmount))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
