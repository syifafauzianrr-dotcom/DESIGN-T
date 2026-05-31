/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  BarChart, 
  Search, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Sparkles,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  UserCheck
} from 'lucide-react';
import { UserAccount } from '../types';

interface AdminPanelProps {
  accounts: UserAccount[];
  onAddUser: (user: Omit<UserAccount, 'id'>) => void;
  onDeleteUser: (id: string) => void;
  onToggleUserStatus: (id: string) => void;
}

export function AdminPanel({
  accounts,
  onAddUser,
  onDeleteUser,
  onToggleUserStatus
}: AdminPanelProps) {
  // Navigation
  const [adminTab, setAdminTab] = useState<'dashboard' | 'kelola'>('dashboard');

  // Search & add user inputs
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addStatus, setAddStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Filtered accounts lists
  const filteredUserAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) return;

    onAddUser({
      name: addName,
      email: addEmail,
      status: addStatus
    });

    setIsAddUserOpen(false);
    setAddName('');
    setAddEmail('');
    setAddStatus('Aktif');
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="monevy-admin-deck">
      {/* Admin Title Bar (Screen 17) */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-950 p-6 rounded-3xl text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md" id="admin-deck-header">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-orange-300">
            <ShieldAlert className="w-3.5 h-3.5" /> Portal Administrasi & Monitoring Monevy
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Monevy - Dashboard Admin</h1>
          <p className="text-slate-350 text-xs max-w-md text-slate-300">
            Kelola keanggotaan mahasiswa STT-NF, periksa statistik rekapitulasi, dan awasi kesehatan aktivitas jaringan lokal.
          </p>
        </div>

        {/* Dynamic Admin Sub-Toggles */}
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/10" id="admin-internal-tabs">
          <button
            id="admin-subtab-dashboard"
            onClick={() => setAdminTab('dashboard')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              adminTab === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Sesi
          </button>
          <button
            id="admin-subtab-kelola"
            onClick={() => setAdminTab('kelola')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              adminTab === 'kelola' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Kelola Data User
          </button>
        </div>
      </div>

      {/* ADMIN SUB-VIEW 1: DASHBOARD METRICS */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6" id="admin-dashboard-view">
          {/* Summary Box row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-summary-grid">
            {/* Total Users */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Anggota</span>
                <span className="text-xl font-bold text-slate-800">1.234</span>
                <span className="text-[9px] text-emerald-600 block font-semibold mt-0.5">Suku Pertumbuhan (+8.2%)</span>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
              <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">User Aktif</span>
                <span className="text-xl font-bold text-slate-800">56</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Berkomitmen Menabung</span>
              </div>
            </div>

            {/* New Registrants */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
              <div className="p-3.5 bg-orange-50 text-orange-600 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Pendaftar Baru</span>
                <span className="text-xl font-bold text-slate-800">89</span>
                <span className="text-[9px] text-orange-600 block font-semibold mt-0.5">Menunggu Verifikasi</span>
              </div>
            </div>

            {/* Laporan Terbuat */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4.5">
              <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <BarChart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Laporan terekspor</span>
                <span className="text-xl font-bold text-slate-800">12</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Bulan Ini Berhasil Terbit</span>
              </div>
            </div>
          </div>

          {/* Activities list / monitoring list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4" id="admin-activity-logs">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-600" /> Monitoring Aktivitas Pengguna Terkini (Real-time)
            </h3>

            <div className="space-y-3.5" id="admin-log-scroller">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">John Doe (john.doe@email.com)</span>
                  <span className="text-slate-400 text-[10px] mt-0.5 block">Mencatatkan pengeluaran baru: "Makan Siang Kantin" -Rp 25.000</span>
                </div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Hari Ini, 12:30</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Jane Smith (jane.smith@email.com)</span>
                  <span className="text-slate-400 text-[10px] mt-0.5 block">Melakukan perubahan anggaran budget "Makanan" ke Rp 1.500.000</span>
                </div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Hari Ini, 11:20</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Bob Wilson (bob.wilson@email.com)</span>
                  <span className="text-slate-400 text-[10px] mt-0.5 block">Gagal masuk sistem: Sandi tidak sesuai pembukuan</span>
                </div>
                <span className="text-orange-500 font-semibold uppercase text-[10px]">Kemarin, 18:45</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SUB-VIEW 2: KELOLA USER (Screen 18) */}
      {adminTab === 'kelola' && (
        <div className="space-y-4" id="admin-kelola-view">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm" id="kelola-control-strip">
            {/* Search User bar */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-user-input"
                type="text"
                placeholder="Cari user terdaftar berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs"
              />
            </div>

            <button
              id="btn-open-adduser"
              onClick={() => setIsAddUserOpen(true)}
              className="px-4 py-2 bg-emerald-650 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>

          {/* Accounts listings table index */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="admin-user-table">
            <div className="divide-y divide-slate-100">
              {filteredUserAccounts.map((acc) => (
                <div 
                  key={acc.id} 
                  className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition text-xs"
                  id={`admin-account-row-${acc.id}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle initials representation */}
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 font-mono text-[11px] uppercase shrink-0">
                      {acc.name.slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block text-sm">{acc.name}</span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">{acc.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge clickable triggers toggle */}
                    <button
                      id={`toggle-user-status-${acc.id}`}
                      onClick={() => onToggleUserStatus(acc.id)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase cursor-pointer border transition ${
                        acc.status === 'Aktif' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100' 
                          : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                      }`}
                    >
                      {acc.status === 'Aktif' ? 'Aktif' : 'Nonaktif'}
                    </button>

                    <button
                      id={`delete-user-${acc.id}`}
                      onClick={() => onDeleteUser(acc.id)}
                      className="p-2 text-slate-350 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredUserAccounts.length === 0 && (
                <div className="text-center py-16 text-slate-400" id="admin-user-empty">
                  Belum ada anggota mahasiswa terdaftar dengan kata kunci pencarian tersebut.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 18 ADD USER SLIDE OVER MODAL */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-105 border-slate-100 overflow-hidden" id="add-user-modal">
            <div className="bg-slate-800 p-5 text-white flex justify-between items-center text-sm">
              <span className="font-bold">Tambah Pengguna Mahasiswa Baru</span>
              <button onClick={() => setIsAddUserOpen(false)} className="p-1 rounded-full hover:bg-white/15 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitUser} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Smith"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-205 border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Alamat Surel Akademik *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.smith@email.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-205 border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold block">Status Awal Keanggotaan</label>
                <select
                  value={addStatus}
                  onChange={(e) => setAddStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-slate-250 border-slate-200 bg-white rounded-xl"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer transition"
              >
                Masukkan ke Jaringan Kampus
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
