/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  photoUrl: string;
  memberSince: string;
  totalTransactions: number;
  monthsActive: number;
  isKIPK: boolean;
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  time: string;
  catatan: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  budgetLimit?: number; // Only for expenses
}

export interface SavingTarget {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface NotificationSetting {
  id: string;
  title: string;
  time: string;
  active: boolean;
  frequency: 'harian' | 'mingguan' | 'bulanan';
}

export interface NotificationLog {
  id: string;
  text: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
}

// Student companion types
export interface AcademicTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  completed: boolean;
  description?: string;
}

export interface ClassSchedule {
  id: string;
  subject: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  color: string;
}

export interface AcademicNote {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Kuliah' | 'Keuangan' | 'Pribadi';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  status: 'Aktif' | 'Nonaktif';
}
