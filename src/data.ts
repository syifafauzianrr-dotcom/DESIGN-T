/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  Transaction,
  BudgetCategory,
  SavingTarget,
  NotificationSetting,
  NotificationLog,
  AcademicTask,
  ClassSchedule,
  AcademicNote,
  UserAccount
} from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'Januari 2024',
  totalTransactions: 156,
  monthsActive: 5,
  isKIPK: true
};

export const INITIAL_CATEGORIES: BudgetCategory[] = [
  // Incomes
  { id: 'cat-inc-1', name: 'Gaji/Part-time', type: 'pemasukan', icon: 'Coins', color: '#10B981' },
  { id: 'cat-inc-2', name: 'Hadiah', type: 'pemasukan', icon: 'Gift', color: '#6366F1' },
  { id: 'cat-inc-3', name: 'Uang Saku Bulanan', type: 'pemasukan', icon: 'GraduationCap', color: '#F59E0B' },
  
  // Expenses
  { id: 'cat-exp-1', name: 'Makanan & Minuman', type: 'pengeluaran', icon: 'Utensils', color: '#EF4444', budgetLimit: 1200000 },
  { id: 'cat-exp-2', name: 'Transportasi', type: 'pengeluaran', icon: 'Car', color: '#3B82F6', budgetLimit: 400000 },
  { id: 'cat-exp-3', name: 'Kuliah & Buku', type: 'pengeluaran', icon: 'BookOpen', color: '#8B5CF6', budgetLimit: 500000 },
  { id: 'cat-exp-4', name: 'Hiburan', type: 'pengeluaran', icon: 'Gamepad2', color: '#EC4899', budgetLimit: 300000 },
  { id: 'cat-exp-5', name: 'Kos/Kas Bulanan', type: 'pengeluaran', icon: 'Home', color: '#F97316', budgetLimit: 800000 }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Gaji Part-time',
    amount: 1000000,
    type: 'pemasukan',
    category: 'Gaji/Part-time',
    date: '2026-05-28',
    time: '14:30',
    catatan: 'Hasil kerja ngajar les privat'
  },
  {
    id: 'tx-2',
    title: 'Buku Kuliah',
    amount: 150000,
    type: 'pengeluaran',
    category: 'Kuliah & Buku',
    date: '2026-05-26',
    time: '09:00',
    catatan: 'Membeli buku referensi Design Thinking'
  },
  {
    id: 'tx-3',
    title: 'Uang Saku Bulanan',
    amount: 1500000,
    type: 'pemasukan',
    category: 'Uang Saku Bulanan',
    date: '2026-05-25',
    time: '10:00',
    catatan: 'Pencairan dana saku bulan ini'
  },
  {
    id: 'tx-4',
    title: 'Kas Bulanan',
    amount: 500000,
    type: 'pengeluaran',
    category: 'Kos/Kas Bulanan',
    date: '2026-05-22',
    time: '11:00',
    catatan: 'Iuran kas kontrakan bulanan mahasiswa'
  },
  {
    id: 'tx-5',
    title: 'Makan Siang Kantin',
    amount: 25000,
    type: 'pengeluaran',
    category: 'Makanan & Minuman',
    date: '2026-05-31',
    time: '12:30',
    catatan: 'Makan siang di kantin STT-NF'
  },
  {
    id: 'tx-6',
    title: 'Bensin Motor',
    amount: 15000,
    type: 'pengeluaran',
    category: 'Transportasi',
    date: '2026-05-30',
    time: '17:45',
    catatan: 'Bensin Pertalite untuk seminggu kuliah'
  },
  {
    id: 'tx-7',
    title: 'Makan Malam',
    amount: 35000,
    type: 'pengeluaran',
    category: 'Makanan & Minuman',
    date: '2026-05-30',
    time: '19:15',
    catatan: 'Nasi goreng dekat kontrakan'
  },
  {
    id: 'tx-8',
    title: 'Nonton Bioskop',
    amount: 50000,
    type: 'pengeluaran',
    category: 'Hiburan',
    date: '2026-05-29',
    time: '20:00',
    catatan: 'Weekend refreshing setelah revisi UTS'
  }
];

export const INITIAL_SAVING_TARGETS: SavingTarget[] = [
  { id: 'target-1', name: 'Laptop Baru', targetAmount: 15000000, currentAmount: 6000000, deadline: '2026-12-31' },
  { id: 'target-2', name: 'Liburan Semester', targetAmount: 5000000, currentAmount: 1500000, deadline: '2026-08-15' },
  { id: 'target-3', name: 'Dana Darurat', targetAmount: 10000000, currentAmount: 1000000, deadline: '2027-01-01' }
];

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: 'ns-1', title: 'Catat Harian', time: '20:00', active: true, frequency: 'harian' },
  { id: 'ns-2', title: 'Cek Budget Mingguan', time: '09:00', active: true, frequency: 'mingguan' },
  { id: 'ns-3', title: 'Laporan Bulanan', time: '10:00', active: false, frequency: 'bulanan' }
];

export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [
  { id: 'log-1', text: 'Pengingat Catat: Yuk, catat pengeluaranmu hari ini biar keuangan tetap sehat!', timestamp: 'Hari ini, 20:00', type: 'info' },
  { id: 'log-2', text: 'Budget Hampir Habis: Pengeluaran kategori Kuliah sudah mencapai 90% dari batas!', timestamp: 'Kemarin, 12:45', type: 'warning' },
  { id: 'log-3', text: 'Target Tercapai Sebagian: Kamu berhasil menabung Rp 500.000 untuk target Laptop Baru!', timestamp: '28 Mei 2026', type: 'success' }
];

export const INITIAL_TASKS: AcademicTask[] = [
  { id: 'task-1', title: 'Laporan Design Thinking Kelompok 17', subject: 'Design Thinking', dueDate: '2026-06-03', priority: 'Tinggi', completed: false, description: 'Menyusun laporan hasil desain web & mobile untuk pemantauan pengeluaran pribadi.' },
  { id: 'task-2', title: 'Membuat ERD Basis Data', subject: 'Basis Data', dueDate: '2026-06-05', priority: 'Sedang', completed: false, description: 'Membuat diagram relasi entitas untuk studi kasus perpustakaan.' },
  { id: 'task-3', title: 'Tugas Mandiri HTML & CSS Grid', subject: 'Pemrograman Web', dueDate: '2026-06-02', priority: 'Rendah', completed: true, description: 'Latihan membuat tata letak dashboard modern responsif.' }
];

export const INITIAL_SCHEDULE: ClassSchedule[] = [
  { id: 'sch-1', subject: 'Design Thinking', day: 'Senin', startTime: '08:30', endTime: '10:30', room: 'R.304', lecturer: 'Misna Asqia, S.Kom., M.Kom.', color: 'emerald' },
  { id: 'sch-2', subject: 'Basis Data', day: 'Selasa', startTime: '10:00', endTime: '12:00', room: 'Lab Komputer 2', lecturer: 'Ahmad Fauzan, M.T.', color: 'blue' },
  { id: 'sch-3', subject: 'Pemrograman Web', day: 'Rabu', startTime: '13:00', endTime: '15:30', room: 'Lab Komputer 4', lecturer: 'Dude Erlangga, M.Kom.', color: 'indigo' },
  { id: 'sch-4', subject: 'Sistem Informasi', day: 'Kamis', startTime: '08:00', endTime: '10:30', room: 'R.102', lecturer: 'Ayu Dia, M.T.I.', color: 'orange' },
  { id: 'sch-5', subject: 'Pendidikan Agama', day: 'Jumat', startTime: '09:00', endTime: '11:00', room: 'Masjid Kampus', lecturer: 'Dr. Haniyah H.', color: 'teal' }
];

export const INITIAL_NOTES: AcademicNote[] = [
  {
    id: 'note-1',
    title: 'Ide Desain Monevy - Task & Budgeting',
    content: 'Monevy membantu mahasiswa membagi pengeluaran bulanan. Setiap bulan ada 1.5 Juta yang harus dicukupkan. Kategori wajib:\n- Kas Kos: 500 rb\n- Buku & Modul: 150 rb\n- Makan sehari-hari: maks 600 rb\n- Sisa 250 rb dimasukkan ke target tabungan LAPTOP BARU.',
    date: '2026-05-29',
    category: 'Keuangan'
  },
  {
    id: 'note-2',
    title: 'Catatan Kuliah Design Thinking - Dosen Bu Misna',
    content: '5 Tahapan Design Thinking:\n1. Empathize: Menggali masalah mahasiswa dalam mengatur anggaran harian\n2. Define: Merumuskan pain points (Uang cepat habis, sulit menabung)\n3. Ideate: Membuat sketsa kawat (wireframe)\n4. Prototype: Mendesain purwarupa interaktif\n5. Test: Evaluasi feedback.',
    date: '2026-05-25',
    category: 'Kuliah'
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  { id: 'usr-1', name: 'John Doe', email: 'john.doe@email.com', status: 'Aktif' },
  { id: 'usr-2', name: 'Jane Smith', email: 'jane.smith@email.com', status: 'Aktif' },
  { id: 'usr-3', name: 'Bob Wilson', email: 'bob.wilson@email.com', status: 'Nonaktif' },
  { id: 'usr-4', name: 'Ayu Dia', email: 'ayu.dia@email.com', status: 'Aktif' },
  { id: 'usr-5', name: 'Dude Erlangga', email: 'dude.erl@email.com', status: 'Aktif' }
];
