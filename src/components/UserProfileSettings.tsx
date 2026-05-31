/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Lock, 
  Eye, 
  Globe, 
  Bell, 
  Award, 
  ShieldCheck, 
  LogOut, 
  Sliders,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  onLogoutTrigger: () => void;
}

export function UserProfileSettings({
  profile,
  onUpdateProfile,
  isAdminMode,
  setIsAdminMode,
  onLogoutTrigger
}: ProfileProps) {
  // Profiles state
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [isKIPK, setIsKIPK] = useState(profile.isKIPK);
  
  // Custom states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'profile' | 'akun'>('profile');

  // Currency
  const [currentCurrency, setCurrentCurrency] = useState('IDR (Rp)');

  // Change Password
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileName,
      email: profileEmail,
      isKIPK: isKIPK
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) return;
    setPassSuccess(true);
    setOldPass('');
    setNewPass('');
    setTimeout(() => setPassSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="monevy-profile-manager">
      {/* Upper Grid header info (Screen 12) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="profile-summary-header">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-2xl border-4 border-emerald-50 object-cover shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h2 className="text-xl font-extrabold text-slate-800">{profile.name}</h2>
              {profile.isKIPK && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider block">
                  Mahasiswa Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-semibold">{profile.email}</p>
            <p className="text-[10px] text-slate-500">Anggota aktif terdaftar sejak: <span className="font-bold text-slate-700">{profile.memberSince}</span></p>
          </div>
        </div>

        {/* User stats widget */}
        <div className="flex gap-4 md:gap-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center text-xs" id="profile-stats">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Record</span>
            <span className="text-lg font-black text-slate-800">{profile.totalTransactions}</span>
            <span className="text-[9px] text-slate-400 block">Transaksi</span>
          </div>
          <div className="h-10 w-px bg-slate-200 self-center" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Aktif</span>
            <span className="text-lg font-black text-slate-800">{profile.monthsActive}</span>
            <span className="text-[9px] text-slate-400 block">Bulan Teratur</span>
          </div>
        </div>
      </div>

      {/* Grid: Settings Sub Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="profile-settings-mesh">
        {/* Left Navigator Menu of Profile panel (Screen 15) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 h-fit" id="settings-shortcuts">
          <h3 className="font-extrabold text-slate-800 text-sm">Bilah Preferensi Akun</h3>
          <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-bold" id="settings-tab-list">
            <button
              id="sub-tab-profile"
              onClick={() => setActiveSubView('profile')}
              className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-center justify-between ${
                activeSubView === 'profile' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="inline-flex items-center gap-2"><User className="w-4 h-4" /> Hub Profil Pengguna</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            
            <button
              id="sub-tab-akun"
              onClick={() => setActiveSubView('akun')}
              className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-center justify-between ${
                activeSubView === 'akun' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="inline-flex items-center gap-2"><Settings className="w-4 h-4" /> Keamanan & Keanggotaan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <hr className="border-slate-50" />

          {/* Admin Mode simulated gate (Screen 17 & 18) */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3" id="admin-mode-gate">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-orange-850 text-orange-800 block">Ruang Simulasi Admin</span>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Tinjau grafik monitoring aktivitas, statistik pengguna STT-NF, kelola data pengguna.</p>
            </div>
            <button
              id="toggle-admin-mode-btn"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                isAdminMode 
                  ? 'bg-orange-600 border-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-white border-orange-200 text-orange-800 hover:bg-orange-50'
              }`}
            >
              <Sliders className="w-4 h-4" /> {isAdminMode ? 'Kembali Ke Mode Mahasiswa' : 'Simulasikan Masuk Admin'}
            </button>
          </div>

          <hr className="border-slate-50" />

          {/* Logout trigger button */}
          <button
            id="btn-trigger-logout"
            onClick={onLogoutTrigger}
            className="w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 text-red-600 text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer border border-red-100"
          >
            <LogOut className="w-4 h-4" /> Keluar Dari Sistem (Logout)
          </button>
        </div>

        {/* Right side interactive Form views */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm" id="active-settings-panel">
          
          {/* Sub-Panel 1: PROFILE HUB */}
          {activeSubView === 'profile' && (
            <div className="space-y-6" id="sub-view-edit-profile">
              <div className="space-y-1 pb-3.5 border-b border-slate-50">
                <h3 className="font-extrabold text-slate-800 text-sm block">Ubah Data Biodata Mahasiswa</h3>
                <p className="text-[11px] text-slate-400">Sunting informasi akun Anda untuk pelaporan yang sinkron</p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2" id="alert-save-profile-success">
                  <Check className="w-4 h-4" /> Berhasil memperbarui profil mahasiswa secara langsung di memori browser Anda!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold text-slate-600 max-w-lg">
                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold">Foto Profil (URL Gambar)</label>
                  <input
                    type="text"
                    value={profile.photoUrl}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Disinkronkan otomatis oleh STT-NF.</span>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold">Nama Lengkap Mahasiswa *</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold">Alamat Surel Mahasiswa *</label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="isKIPK-profile"
                    checked={isKIPK}
                    onChange={(e) => setIsKIPK(e.target.checked)}
                    className="w-4.5 h-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="isKIPK-profile" className="text-slate-700 font-bold select-none cursor-pointer">
                    Saya berkomitmen menjaga konsistensi anggaran bulanan
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Perubahan Profil
                </button>
              </form>
            </div>
          )}

          {/* Sub-Panel 2: SECURITY & PREFERENCES */}
          {activeSubView === 'akun' && (
            <div className="space-y-6" id="sub-view-security-prefs">
              <div className="space-y-1 pb-3.5 border-b border-slate-50">
                <h3 className="font-extrabold text-slate-800 text-sm block">Keamanan Password & Preferensi</h3>
                <p className="text-[11px] text-slate-400">Konfigurasi sandi dan parameter mata uang sistem</p>
              </div>

              {/* Password simulation form */}
              <div className="space-y-4 max-w-lg">
                <h4 className="font-extrabold text-xs text-slate-800">Ubah Kata Sandi (Sandi Baru)</h4>
                
                {passSuccess && (
                  <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg" id="alert-change-password-success">
                    ✓ Sukses! Password pengaman Anda telah diatur ulang ke sandi teranyar secara aman.
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 text-xs font-semibold text-slate-650 text-slate-600">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold">Kata Sandi Saat Ini</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold">Kata Sandi Baru</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-700 hover:bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Ganti Kata Sandi
                  </button>
                </form>
              </div>

              <hr className="border-slate-100" />

              {/* Preferences: Currency config */}
              <div className="space-y-3 max-w-lg text-xs" id="currency-preference">
                <h4 className="font-extrabold text-slate-800">Ubah Default Mata Uang Aplikasi</h4>
                <div className="flex gap-2.5">
                  {['IDR (Rp)', 'USD ($)', 'EUR (€)'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrentCurrency(curr)}
                      className={`px-4 py-2 rounded-xl font-bold transition border cursor-pointer ${
                        currentCurrency === curr 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block leading-tight">Seluruh kalkulasi konversi rupiah dihitung otomatis dan tersimpan di database lokal.</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ChevronRight utility
function ChevronRight(props: any) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
