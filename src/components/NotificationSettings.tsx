/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  Plus, 
  Trash2,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { NotificationSetting, NotificationLog } from '../types';

interface NotificationProps {
  settings: NotificationSetting[];
  onToggleSetting: (id: string) => void;
  onAddSetting: (setting: Omit<NotificationSetting, 'id'>) => void;
  logs: NotificationLog[];
}

export function NotificationSettings({
  settings,
  onToggleSetting,
  onAddSetting,
  logs
}: NotificationProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newFrequency, setNewFrequency] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddSetting({
      title: newTitle,
      time: newTime,
      active: true,
      frequency: newFrequency
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewTime('09:00');
    setNewFrequency('harian');
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="monevy-notification-settings-tab">
      {/* Notifications Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="notify-top-bar">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifikasi & Pengingat</h1>
          <p className="text-xs text-slate-500">Atur komitmen mencatat pengeluaran Anda tepat waktu secara berkala.</p>
        </div>
        <button
          id="btn-add-notification-setting"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition inline-flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Pengingat Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="notifications-body-grid">
        {/* Left Card: Active reminders settings (Screen 13) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5" id="notif-settings-list">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-emerald-600" /> Pengingat Otomatis Berjadwal
          </h3>

          <div className="space-y-3.5">
            {settings.map((set) => (
              <div 
                key={set.id}
                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-100/50 transition cursor-pointer"
                id={`notif-setting-row-${set.id}`}
                onClick={() => onToggleSetting(set.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-white border border-slate-200 text-emerald-600`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 text-xs md:text-sm block">{set.title}</span>
                    <span className="text-[10px] md:text-[11px] text-slate-400 block font-medium">
                      Setiap {set.frequency} pukul {set.time} WIB
                    </span>
                  </div>
                </div>

                {/* Toggle trigger */}
                <button
                  id={`toggle-button-${set.id}`}
                  className="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer"
                >
                  {set.active ? (
                    <ToggleRight className="w-10 h-10 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-slate-350" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Previous Reminders logs history */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4" id="previous-logs-list">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-emerald-600" /> Riwayat Notifikasi Terkirim
          </h3>

          <div className="space-y-3">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="p-3.5 bg-slate-50 border border-slate-100/60 rounded-2xl flex items-start gap-3"
                id={`notif-log-${log.id}`}
              >
                <div className="mt-0.5 shrink-0">
                  {log.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  ) : log.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11.5px] font-medium leading-relaxed text-slate-700">
                    {log.text}
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 block">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pop up form */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden" id="add-reminder-modal">
            <div className="bg-emerald-650 bg-emerald-600 p-5 text-white flex justify-between items-center text-xs md:text-sm">
              <span className="font-bold">Buat Pengingat Keuangan Kustom</span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="font-bold block text-slate-500">Nama Tugas Pengingat *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasih makan celengan, Bayar kosan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold block text-slate-500">Pukul Pengingat *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20:00"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold block text-slate-500">Frekuensi</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                  >
                    <option value="harian">Harian</option>
                    <option value="mingguan">Mingguan</option>
                    <option value="bulanan">Bulanan</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition"
              >
                Aktifkan Pengingat
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
