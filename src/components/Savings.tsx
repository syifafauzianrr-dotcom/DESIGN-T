/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Coins, 
  Trash2, 
  X, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { SavingTarget } from '../types';

interface SavingsProps {
  targets: SavingTarget[];
  onAddTarget: (target: Omit<SavingTarget, 'id'>) => void;
  onUpdateProgress: (id: string, amount: number) => void;
  onDeleteTarget: (id: string) => void;
}

export function Savings({
  targets,
  onAddTarget,
  onUpdateProgress,
  onDeleteTarget
}: SavingsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetName, setTargetName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('');

  // Settle progress adding state
  const [activeAdjustId, setActiveAdjustId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState('');

  // Format to IDR rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleSubmitTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName || !targetAmount) return;

    onAddTarget({
      name: targetName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: initialAmount ? parseFloat(initialAmount) : 0,
      deadline: targetDeadline || undefined
    });

    setIsAddOpen(false);
    setTargetName('');
    setTargetAmount('');
    setInitialAmount('');
    setTargetDeadline('');
  };

  const handleApplyProgress = (id: string) => {
    const val = parseFloat(adjustValue);
    if (isNaN(val) || val <= 0) return;
    onUpdateProgress(id, val);
    setActiveAdjustId(null);
    setAdjustValue('');
  };

  return (
    <div className="space-y-6" id="monevy-savings-hub">
      {/* Target heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="savings-top-bar">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Target Tabungan Masa Depan</h1>
          <p className="text-xs text-slate-500">Membantu mahasiswa menyisihkan sisa uang bulanan secara konsisten.</p>
        </div>
        <button
          id="btn-add-saving-target"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm transition inline-flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" /> Tambah Target Menabung
        </button>
      </div>

      {/* Target listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="saving-targets-grid">
        {targets.map((target) => {
          const percentage = Math.min(100, Math.round((target.currentAmount / target.targetAmount) * 100));
          
          return (
            <div 
              key={target.id} 
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition relative flex flex-col justify-between group"
              id={`saving-card-${target.id}`}
            >
              {/* Header inside card */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => onDeleteTarget(target.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition rounded-lg cursor-pointer"
                    title="Hapus Target"
                    id={`delete-target-${target.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-base">{target.name}</h3>
                  {target.deadline && (
                    <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Target s/d {target.deadline}
                    </span>
                  )}
                </div>

                {/* Progress bar info */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Terkumpul</span>
                    <span className="font-extrabold text-slate-800">{percentage}%</span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {formatRupiah(target.currentAmount)}
                    <span className="text-slate-400 text-xs font-semibold"> / {formatRupiah(target.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-emerald-600`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Adjust dynamic savings input */}
              <div className="mt-5 pt-4 border-t border-slate-50 text-center">
                {activeAdjustId !== target.id ? (
                  <button
                    id={`btn-adjust-${target.id}`}
                    onClick={() => {
                      setActiveAdjustId(target.id);
                      setAdjustValue('');
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-bold transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" /> Tambah Tabungan Anda
                  </button>
                ) : (
                  <div className="space-y-2" id={`adjust-panel-${target.id}`}>
                    <div className="flex gap-1.5">
                      <input
                        id={`input-adjust-amount-${target.id}`}
                        type="number"
                        min="1000"
                        placeholder="Jumlah Rp..."
                        value={adjustValue}
                        onChange={(e) => setAdjustValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-lg text-xs"
                      />
                      <button
                        id={`btn-save-adjust-${target.id}`}
                        onClick={() => handleApplyProgress(target.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setActiveAdjustId(null)}
                        className="p-1 px-2 border border-slate-200 hover:bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <span className="text-[9px] text-slate-400 block text-left">Masukkan nominal tabungan yang disetor</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {targets.length === 0 && (
          <div className="text-center py-16 col-span-full border border-dashed border-slate-200 rounded-3xl" id="savings-empty-state">
            <Target className="w-12 h-12 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Belum ada target menabung terekam.</p>
            <p className="text-xs text-slate-450 text-slate-400 mt-1">Gunakan tombol di pojok kanan atas untuk merancang impian laptop atau bekal magang Anda!</p>
          </div>
        )}
      </div>

      {/* Rencana Target Pop-up */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="add-target-modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden" id="add-target-modal">
            {/* Header */}
            <div className="bg-emerald-600 p-5 text-white flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Rancang Target Tabungan</h3>
                <p className="text-xs text-emerald-100">Wujudkan laptop atau dana darurat bekal kuliah Anda</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitTarget} className="p-6 space-y-4 text-xs font-medium text-slate-600">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Nama Impian Misi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptop ASUS Core i5, Tiket Pulang Kampung"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Target Jumlah Tabungan (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="50000"
                  placeholder="e.g. 15000000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Sudah Terkumpul Saat Ini (Rp)</label>
                <input
                  type="number"
                  placeholder="e.g. 500000 (boleh dikosongkan)"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Batas Tanggal Pencapaian (Opsional)</label>
                <input
                  type="date"
                  value={targetDeadline}
                  onChange={(e) => setTargetDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold hover:shadow-md transition cursor-pointer"
                >
                  Buat Rencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
