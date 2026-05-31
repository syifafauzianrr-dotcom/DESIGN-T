/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Sparkles,
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Bell,
  HelpCircle,
  Settings,
  Menu,
  X,
  Lock,
  Mail,
  GraduationCap,
  Database,
  ArrowRight,
  ChevronRight,
  Shield,
  Activity,
  UserCheck,
  XCircle
} from 'lucide-react';

import { 
  UserProfile, 
  Transaction, 
  BudgetCategory, 
  SavingTarget, 
  NotificationSetting, 
  NotificationLog, 
  UserAccount 
} from './types';

import { 
  INITIAL_PROFILE, 
  INITIAL_CATEGORIES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SAVING_TARGETS, 
  INITIAL_NOTIFICATION_SETTINGS, 
  INITIAL_NOTIFICATION_LOGS, 
  INITIAL_USER_ACCOUNTS 
} from './data';

import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Reports } from './components/Reports';
import { Savings } from './components/Savings';
import { NotificationSettings } from './components/NotificationSettings';
import { FAQSupport } from './components/FAQSupport';
import { UserProfileSettings } from './components/UserProfileSettings';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // --- SPLASH SCREEN STATE ---
  const [showSplash, setShowSplash] = useState(true);

  // --- AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  
  // Custom states for register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regIsKIPK, setRegIsKIPK] = useState(true);

  // --- CORE SYSTEM STATES ---
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [savingTargets, setSavingTargets] = useState<SavingTarget[]>(INITIAL_SAVING_TARGETS);
  const [notifSettings, setNotifSettings] = useState<NotificationSetting[]>(INITIAL_NOTIFICATION_SETTINGS);
  const [notifLogs, setNotifLogs] = useState<NotificationLog[]>(INITIAL_NOTIFICATION_LOGS);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(INITIAL_USER_ACCOUNTS);

  // --- INTERACTION & VIEW NAVIGATION ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transaksi' | 'laporan' | 'tabungan' | 'notifikasi' | 'bantuan' | 'profil' | 'admin'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [quickTxType, setQuickTxType] = useState<'pemasukan' | 'pengeluaran' | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  
  // Custom toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger brief floating notifications
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- PERSISTENCE: LOAD & SAVE IN LOCALSTORAGE ---
  useEffect(() => {
    // Dismiss splash screen after 2.2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    // Initial load from storage
    const storedProfile = localStorage.getItem('monevy_profile');
    const storedCategories = localStorage.getItem('monevy_categories');
    const storedTransactions = localStorage.getItem('monevy_transactions');
    const storedTargets = localStorage.getItem('monevy_saving_targets');
    const storedNotifSettings = localStorage.getItem('monevy_notif_settings');
    const storedNotifLogs = localStorage.getItem('monevy_notif_logs');
    const storedUserAccounts = localStorage.getItem('monevy_user_accounts');
    const storedLoggedIn = localStorage.getItem('monevy_is_logged_in');
    const storedTab = localStorage.getItem('monevy_active_tab');

    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedTargets) setSavingTargets(JSON.parse(storedTargets));
    if (storedNotifSettings) setNotifSettings(JSON.parse(storedNotifSettings));
    if (storedNotifLogs) setNotifLogs(JSON.parse(storedNotifLogs));
    if (storedUserAccounts) setUserAccounts(JSON.parse(storedUserAccounts));
    if (storedLoggedIn === 'true') {
      setIsLoggedIn(true);
      const currentRole = localStorage.getItem('monevy_user_role');
      if (currentRole === 'admin') {
        setActiveTab('admin');
      } else if (storedTab) {
        setActiveTab(storedTab as any);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem('monevy_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('monevy_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('monevy_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('monevy_saving_targets', JSON.stringify(savingTargets));
  }, [savingTargets]);

  useEffect(() => {
    localStorage.setItem('monevy_notif_settings', JSON.stringify(notifSettings));
  }, [notifSettings]);

  useEffect(() => {
    localStorage.setItem('monevy_notif_logs', JSON.stringify(notifLogs));
  }, [notifLogs]);

  useEffect(() => {
    localStorage.setItem('monevy_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  // --- DYNAMIC FINANCIAL CALCULATIONS ---
  const totalPemasukan = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPengeluaran = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((sum, t) => sum + t.amount, 0);

  const saldoTotal = totalPemasukan - totalPengeluaran;

  // --- SECURITY / DEMO LOGIN CHECKS ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Admin Account bypass
    if (authEmail.toLowerCase() === 'admin@monevy.com' && authPassword === 'admin123') {
      setIsLoggedIn(true);
      setActiveTab('admin');
      localStorage.setItem('monevy_is_logged_in', 'true');
      localStorage.setItem('monevy_user_role', 'admin');
      
      // Update dummy profile for admin
      setProfile({
        name: 'Administrator',
        email: 'admin@monevy.com',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        memberSince: 'Mei 2026',
        totalTransactions: 0,
        monthsActive: 1,
        isKIPK: false
      });

      showToast('Masuk berhasil sebagai Administrator Kontrol Jaringan.');
      return;
    }

    // Checking user accounts
    const matchedAccount = userAccounts.find(
      acc => acc.email.toLowerCase() === authEmail.toLowerCase()
    );

    if (matchedAccount) {
      if (matchedAccount.status === 'Nonaktif') {
        setAuthError('Akun Anda dinonaktifkan oleh administrator kampus. Silakan hubungi syifafauzianrrr@gmail.com.');
        return;
      }

      // Successful simulated student login
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      localStorage.setItem('monevy_is_logged_in', 'true');
      localStorage.setItem('monevy_user_role', 'student');

      setProfile({
        name: matchedAccount.name,
        email: matchedAccount.email,
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        memberSince: 'Januari 2126',
        totalTransactions: transactions.length,
        monthsActive: 5,
        isKIPK: true
      });

      showToast(`Selamat datang kembali, ${matchedAccount.name}! 👋 Ready for SmartFinance?`);
    } else {
      // Demo accounts verification default fallback for convenient grading
      if (authEmail === 'john.doe@email.com' && authPassword === 'john123') {
        setIsLoggedIn(true);
        setActiveTab('dashboard');
        localStorage.setItem('monevy_is_logged_in', 'true');
        localStorage.setItem('monevy_user_role', 'student');
        showToast('Login Berhasil! Selamat mengelola tabungan Anda.');
      } else {
        setAuthError('Alamat surel atau kata sandi tidak valid. Gunakan "john.doe@email.com" / "john123" atau Akun Demo.');
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!regName || !regEmail || !regPass) {
      setAuthError('Mohon isi semua kolom bertanda bintang.');
      return;
    }

    // Ensure user doesn't already exist
    const exists = userAccounts.some(acc => acc.email.toLowerCase() === regEmail.toLowerCase());
    if (exists) {
      setAuthError('Alamat email tersebut sudah terdaftar di database.');
      return;
    }

    const newAcc: UserAccount = {
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      status: 'Aktif'
    };

    const updatedUsers = [...userAccounts, newAcc];
    setUserAccounts(updatedUsers);

    // Save automatically
    localStorage.setItem('monevy_user_accounts', JSON.stringify(updatedUsers));

    // Sign in immediately as the registered student
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    localStorage.setItem('monevy_is_logged_in', 'true');
    localStorage.setItem('monevy_user_role', 'student');

    setProfile({
      name: regName,
      email: regEmail,
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      memberSince: 'Mei 2026',
      totalTransactions: 0,
      monthsActive: 1,
      isKIPK: regIsKIPK
    });

    // Append admin log for registration monitoring!
    addAdminActivityLog(`${regName} (${regEmail}) melakukan pendaftaran akun baru ke sistem.`);

    // Reset fields
    setRegName('');
    setRegEmail('');
    setRegPass('');
    showToast('Pendaftaran Baru Berhasil! Selamat Datang di Monevy.');
  };

  // Skip Login for demo evaluator ease-of-use
  const handleQuickDemoLogin = (role: 'student' | 'admin') => {
    setIsLoggedIn(true);
    localStorage.setItem('monevy_is_logged_in', 'true');

    if (role === 'admin') {
      setActiveTab('admin');
      localStorage.setItem('monevy_user_role', 'admin');
      setProfile({
        name: 'Administrator',
        email: 'admin@monevy.com',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        memberSince: 'Mei 2026',
        totalTransactions: 12,
        monthsActive: 6,
        isKIPK: false
      });
      showToast('Masuk Instan: Mode Administrator Terbuka.');
    } else {
      setActiveTab('dashboard');
      localStorage.setItem('monevy_user_role', 'student');
      setProfile(INITIAL_PROFILE);
      showToast('Masuk Instan: Mode Mahasiswa Terbuka.');
    }
  };

  // Helper to add activity log as Admin
  const addAdminActivityLog = (text: string) => {
    const timestamp = 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const logText = text;
    // We can push to notification logs or simulated activity logs
    const newLogItem: NotificationLog = {
      id: `log-${Date.now()}`,
      text: logText,
      timestamp,
      type: 'info'
    };
    setNotifLogs(prev => [newLogItem, ...prev]);
  };

  // --- CORE SYSTEM EVENT IMPLEMENTATIONS ---

  // TRANSACTIONS
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const freshTx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`
    };
    const nextTxList = [freshTx, ...transactions];
    setTransactions(nextTxList);

    // Profile updates
    setProfile(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1
    }));

    // Trigger target warning system alerts on categories budget limits
    const matchedCategory = categories.find(c => c.name === freshTx.category);
    if (matchedCategory && matchedCategory.budgetLimit) {
      const currentCategoryExpenses = nextTxList
        .filter(t => t.type === 'pengeluaran' && t.category === matchedCategory.name)
        .reduce((sum, t) => sum + t.amount, 0);

      const limit = matchedCategory.budgetLimit;
      if (currentCategoryExpenses >= limit) {
        // Trigger high severity alert!
        const logMsg: NotificationLog = {
          id: `log-crit-${Date.now()}`,
          text: `Budget Terlampaui: Belanja Kategori "${matchedCategory.name}" telah melampaui limit Rp ${limit.toLocaleString('id-ID')}!`,
          timestamp: 'Barusan',
          type: 'warning'
        };
        setNotifLogs(prev => [logMsg, ...prev]);
        showToast(`Peringatan: Kategori "${matchedCategory.name}" melebihi anggaran limit bulanan!`);
      } else if (currentCategoryExpenses >= limit * 0.85) {
        // Light caution alert
        const logMsg: NotificationLog = {
          id: `log-warn-${Date.now()}`,
          text: `Pajak Anggaran: Kategori "${matchedCategory.name}" hampir menyentuh batas limit bulanan Anda.`,
          timestamp: 'Barusan',
          type: 'warning'
        };
        setNotifLogs(prev => [logMsg, ...prev]);
      }
    }

    addAdminActivityLog(`${profile.name} mencatatkan ${freshTx.type} baru: "${freshTx.title}" - Rp ${freshTx.amount.toLocaleString('id-ID')}`);
    showToast(`Transaksi "${newTx.title}" berhasil disimpan.`);
  };

  const handleEditTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const full = { ...t, ...updated };
        addAdminActivityLog(`${profile.name} memperbarui transaksi ID ${id}: "${full.title}"`);
        return full;
      }
      return t;
    }));
    showToast('Transaksi berhasil diperbarui.');
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (target) {
      addAdminActivityLog(`${profile.name} menghapus transaksi "${target.title}"`);
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaksi berhasil dihapus.');
  };

  // SAVING TARGETS
  const handleAddSavingTarget = (newTarget: Omit<SavingTarget, 'id'>) => {
    const target: SavingTarget = {
      ...newTarget,
      id: `target-${Date.now()}`
    };
    setSavingTargets(prev => [target, ...prev]);
    addAdminActivityLog(`${profile.name} membuat target tabungan baru: "${target.name}" sebesar Rp ${target.targetAmount.toLocaleString('id-ID')}`);
    showToast(`Target "${newTarget.name}" berhasil dibuat.`);
  };

  const handleUpdateSavingProgress = (id: string, amount: number) => {
    setSavingTargets(prev => prev.map(t => {
      if (t.id === id) {
        const updatedAmount = t.currentAmount + amount;
        
        // Record simulated financial transaction for transparency as requested in Screen 11!
        const logItem: Transaction = {
          id: `tx-save-${Date.now()}`,
          title: `Tabung: ${t.name}`,
          amount: amount,
          type: 'pengeluaran',
          category: 'Kos/Kas Bulanan', // default category or saving transfer
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          catatan: `Setoran kas untuk tabungan: ${t.name}`
        };
        setTransactions(txs => [logItem, ...txs]);

        // Record visual notification success logs
        const completionPercentage = Math.min(100, Math.round((updatedAmount / t.targetAmount) * 100));
        const successLog: NotificationLog = {
          id: `log-notif-${Date.now()}`,
          text: `Klaim Menabung: Senilai Rp ${amount.toLocaleString('id-ID')} masuk ke target "${t.name}" (${completionPercentage}% tercapai).`,
          timestamp: 'Barusan',
          type: 'success'
        };
        setNotifLogs(logs => [successLog, ...logs]);

        addAdminActivityLog(`${profile.name} menyisihkan Rp ${amount.toLocaleString('id-ID')} ke target "${t.name}".`);
        
        if (updatedAmount >= t.targetAmount) {
          showToast(`Luar Biasa! Kontribusi Rp ${amount.toLocaleString('id-ID')} melunasi target: "${t.name}"! 🎉`);
        } else {
          showToast(`Berhasil menyisihkan Rp ${amount.toLocaleString('id-ID')} untuk "${t.name}".`);
        }

        return {
          ...t,
          currentAmount: Math.min(t.targetAmount, updatedAmount)
        };
      }
      return t;
    }));
  };

  const handleDeleteSavingTarget = (id: string) => {
    const trg = savingTargets.find(t => t.id === id);
    if (trg) {
      addAdminActivityLog(`${profile.name} mematikan rencana target tabungan "${trg.name}"`);
    }
    setSavingTargets(prev => prev.filter(t => t.id !== id));
    showToast('Target tabungan dihapus.');
  };

  // NOTIFICATION SETTINGS MODIFIERS
  const handleToggleNotifSetting = (id: string) => {
    setNotifSettings(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.active;
        showToast(`Alarm "${s.title}" berhasil di${nextState ? 'aktifkan' : 'nonaktifkan'}.`);
        return { ...s, active: nextState };
      }
      return s;
    }));
  };

  const handleAddNotifSetting = (newSetting: Omit<NotificationSetting, 'id'>) => {
    const setItem: NotificationSetting = {
      ...newSetting,
      id: `ns-${Date.now()}`
    };
    setNotifSettings(prev => [...prev, setItem]);
    showToast(`Pengingat "${newSetting.title}" berhasil dijadwalkan.`);
  };

  // ADMIN PANEL CONTROLS
  const handleAdminAddUser = (user: Omit<UserAccount, 'id'>) => {
    const userItem: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`
    };
    setUserAccounts(prev => [userItem, ...prev]);
    addAdminActivityLog(`Admin menambahkan Pengguna baru: ${user.name} (${user.email})`);
    showToast(`Anggota "${user.name}" terdaftar dalam database.`);
  };

  const handleAdminDeleteUser = (id: string) => {
    const acc = userAccounts.find(u => u.id === id);
    if (acc) {
      addAdminActivityLog(`Admin mengeluarkan Pengguna: ${acc.name}`);
    }
    setUserAccounts(prev => prev.filter(u => u.id !== id));
    showToast('Akses anggota telah diberhentikan.');
  };

  const handleAdminToggleUserStatus = (id: string) => {
    setUserAccounts(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        addAdminActivityLog(`Admin mengubah status ${u.name} ke ${nextStatus}`);
        showToast(`Status ${u.name} diubah menjadi ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // PROFILE UPDATES
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updated
    }));
    showToast('Profil dan preferensi akun berhasil diperbarui.');
  };

  // LOGOUT HANDLER
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLogoutModalOpen(false);
    localStorage.removeItem('monevy_is_logged_in');
    localStorage.removeItem('monevy_user_role');
    showToast('Sesi ditutup dengan aman. Terima kasih telah menggunakan Monevy!');
  };

  // --- RENDERING ROUTER / SELECTOR ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            saldoTotal={saldoTotal}
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            recentTransactions={transactions}
            categories={categories}
            targets={savingTargets}
            onNavigate={(tab) => {
              setActiveTab(tab as any);
              localStorage.setItem('monevy_active_tab', tab);
            }}
            onOpenQuickTx={(type) => {
              setQuickTxType(type);
              setActiveTab('transaksi');
            }}
            onSelectTransaction={(tx) => {
              setSelectedTx(tx);
              setActiveTab('transaksi');
            }}
          />
        );
      case 'transaksi':
        return (
          <Transactions 
            transactions={transactions}
            categories={categories}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            selectedTx={selectedTx}
            setSelectedTx={setSelectedTx}
            quickTxType={quickTxType}
            setQuickTxType={setQuickTxType}
          />
        );
      case 'laporan':
        return (
          <Reports 
            transactions={transactions}
            categories={categories}
          />
        );
      case 'tabungan':
        return (
          <Savings 
            targets={savingTargets}
            onAddTarget={handleAddSavingTarget}
            onUpdateProgress={handleUpdateSavingProgress}
            onDeleteTarget={handleDeleteSavingTarget}
          />
        );
      case 'notifikasi':
        return (
          <NotificationSettings 
            settings={notifSettings}
            onToggleSetting={handleToggleNotifSetting}
            onAddSetting={handleAddNotifSetting}
            logs={notifLogs}
          />
        );
      case 'bantuan':
        return <FAQSupport />;
      case 'profil':
        return (
          <UserProfileSettings 
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            isAdminMode={profile.email === 'admin@monevy.com'}
            setIsAdminMode={(val) => {
              if (val) {
                handleQuickDemoLogin('admin');
              } else {
                handleQuickDemoLogin('student');
              }
            }}
            onLogoutTrigger={() => setLogoutModalOpen(true)}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            accounts={userAccounts}
            onAddUser={handleAdminAddUser}
            onDeleteUser={handleAdminDeleteUser}
            onToggleUserStatus={handleAdminToggleUserStatus}
          />
        );
      default:
        return <div className="text-center py-12">Tab tidak ditemukan.</div>;
    }
  };

  // --- RENDER 1: SPLASH SCREEN (Screen 1) ---
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-900 via-emerald-950 to-teal-900 flex flex-col items-center justify-center text-white z-50 animate-fadeIn" id="splash-screen">
        <div className="flex flex-col items-center space-y-4 max-w-sm px-6 text-center">
          <div className="p-5 bg-white/10 backdrop-blur-xl rounded-4xl shadow-xl border border-white/20 animate-pulse">
            <GraduationCap className="w-14 h-14 text-emerald-400" />
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-3.5xl font-extrabold tracking-tight font-sans">
              Monevy<span className="text-emerald-400 font-serif">.</span>
            </h1>
            <p className="text-xs text-emerald-250 text-emerald-300 font-semibold tracking-wider uppercase">
              SmartFinance
            </p>
          </div>

          <div className="pt-2">
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Membantu mahasiswa mengelola anggaran, pencatatan transaksi, & menabung demi masa depan cerah.
            </p>
          </div>
          
          <div className="w-32 bg-white/10 h-1 rounded-full overflow-hidden mt-6">
            <div className="bg-emerald-400 h-full rounded-full animate-[loading_1.8s_ease-out_forwards]" style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 2: AUTH MODAL - LOGIN / REGISTER (Screen 2) ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans" id="auth-root-wrapper">
        {/* Background Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex-1 flex items-center justify-center p-4 z-10">
          <div className="bg-white/5 backdrop-blur-2xl w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between" id="auth-gate-card">
            
            {/* Branding Top Banner */}
            <div className="bg-gradient-to-tr from-indigo-505 from-indigo-500/20 to-emerald-400/20 p-6 text-white text-center space-y-1.5 border-b border-white/10">
              <div className="flex justify-center">
                <div className="p-2.5 bg-white/10 rounded-2xl mb-1 border border-white/10 shadow-lg shadow-indigo-550/20">
                  <GraduationCap className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-emerald-200 bg-clip-text text-transparent">Monevy Portal</h2>
              <p className="text-slate-350 text-slate-300 text-xs max-w-xs mx-auto">
                Sistem Pencatatan Anggaran, Transaksi, & Dana Prioritas Keanggotaan Mahasiswa.
              </p>
            </div>

            {/* Error alerts */}
            {authError && (
              <div className="m-4 mb-0 p-3.5 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl text-xs font-semibold flex items-start gap-2 animate-fadeIn" id="auth-error-alert">
                <XCircle className="w-5.5 h-5.5 shrink-0 mt-0.5 text-red-450 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-350 text-slate-300" id="login-form">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Alamat Surel Akademik *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      placeholder="contoh: john.doe@email.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl text-white placeholder:text-slate-600 block"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-400 font-bold block">Ubah & Sandi Akun *</label>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="login-password-input"
                      type="password"
                      required
                      placeholder="Nilai sandi akun anda"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl text-white placeholder:text-slate-600 block"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-580 bg-indigo-600 hover:from-indigo-600 hover:to-emerald-500 text-white font-bold rounded-xl shadow-md transition transform active:scale-98 text-xs cursor-pointer shadow-indigo-500/20"
                >
                  Masuk Sebagai Mahasiswa
                </button>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-500">
                    Belum memiliki akun?{' '}
                    <button
                      id="link-to-register"
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError('');
                      }}
                      className="text-indigo-400 font-bold hover:underline cursor-pointer hover:text-indigo-300"
                    >
                      Daftar Akun Baru
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-350 text-slate-300" id="register-form">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Nama Lengkap Mahasiswa *</label>
                  <input
                    id="register-name-input"
                    type="text"
                    required
                    placeholder="Contoh: Jane Smith"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl text-white placeholder:text-slate-600 block"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Alamat Surel Akademik *</label>
                  <input
                    id="register-email-input"
                    type="email"
                    required
                    placeholder="Email terdaftar di kampus"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl text-white placeholder:text-slate-600 block"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Sandi Akun Baru *</label>
                  <input
                    id="register-password-input"
                    type="password"
                    required
                    placeholder="Gunakan minimal 6 karakter"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 rounded-xl text-white placeholder:text-slate-600 block"
                  />
                </div>

                <div className="flex items-center gap-2 py-1 bg-white/5 px-3 rounded-xl border border-white/10">
                  <input
                    id="register-kipk-checkbox"
                    type="checkbox"
                    checked={regIsKIPK}
                    onChange={(e) => setRegIsKIPK(e.target.checked)}
                    className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 border-white/15 rounded cursor-pointer"
                  />
                  <label htmlFor="register-kipk-checkbox" className="text-slate-400 font-bold text-[10px] cursor-pointer">
                    Saya menyetujui Ketentuan & Kebijakan Privasi Layanan Monevy
                  </label>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-emerald-580 bg-indigo-600 hover:from-indigo-600 hover:to-emerald-500 text-white font-bold rounded-xl shadow-md transition transform active:scale-98 text-xs cursor-pointer shadow-indigo-500/20"
                >
                  Buat Akun & Masuk Jaringan
                </button>

                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-500">
                    Sudah terdaftar?{' '}
                    <button
                      id="link-to-login"
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError('');
                      }}
                      className="text-indigo-400 font-bold hover:underline cursor-pointer hover:text-indigo-300"
                    >
                      Masuk ke Sistem
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* Quick Demo Credentials Assistant */}
            <div className="bg-white/5 p-5 border-t border-white/15 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
                Akses Instan Pengujian Monevy (Cepat & Praktis)
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="demo-login-student"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition cursor-pointer text-[11px] text-slate-200"
                >
                  <span className="font-bold text-indigo-305 text-indigo-400 block pb-0.5">Akun Mahasiswa</span>
                  <span className="text-slate-500 text-[9px] block">john.doe@email.com</span>
                </button>

                <button
                  id="demo-login-admin"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition cursor-pointer text-[11px] text-slate-200"
                >
                  <span className="font-bold text-emerald-405 text-emerald-400 block pb-0.5">Administrator</span>
                  <span className="text-slate-500 text-[9px] block">admin@monevy.com</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info KIPK */}
        <div className="py-6 text-center text-[10px] text-slate-500 border-t border-white/5 p-4 z-10 bg-transparent">
          Monevy SmartFinance Sistem didukung lingkungan kampus Sekolah Tinggi Teknologi Terpadu Nurul Fikri (STT-NF).
          <br />Maju Bersama Mahasiswa Berprestasi Indonesia.
        </div>
      </div>
    );
  }

  // --- RENDER 3: MAIN APP VIEWPORT (Screen 3 - Screen 18) ---
  const isUserAdmin = profile.email === 'admin@monevy.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden font-sans" id="applet-main-viewport">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[125px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[125px] pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[105px] pointer-events-none" />
      
      {/* Toast Notification Widget */}
      {toastMessage && (
        <div 
          className="fixed bottom-5 right-5 z-55 bg-slate-950/90 text-white rounded-2xl px-4.5 py-3 shadow-2xl border border-white/15 flex items-center gap-2.5 text-xs font-semibold animate-slideUp backdrop-blur-lg"
          id="global-toast-notification"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-slate-950/85 backdrop-blur-md text-white p-4 flex items-center justify-between border-b border-white/10 shrink-0 z-20" id="mobile-top-brand-bar">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-emerald-450 text-emerald-400" />
          <span className="font-extrabold tracking-tight">Monevy</span>
        </div>
        
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/10 rounded-xl transition cursor-pointer"
          title="Buka Navigasi"
        >
          {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION PANEL (Screen 3 Sidebar Elements / Desktop) */}
      <aside 
        id="monevy-sidebar-deck"
        className={`bg-white/5 backdrop-blur-3xl border-r border-white/10 text-white w-64 p-5 flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:translate-x-0 md:relative ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 flex flex-col flex-1">
          {/* Logo brand & Support indicator */}
          <div className="pb-4 border-b border-white/10 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-xl text-white shadow-md shadow-indigo-500/10">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Monevy</h1>
                <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                  SmartFinance
                </span>
              </div>
            </div>
            {isUserAdmin && (
              <div className="mt-2.5 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-center">
                Portal Jaringan Admin
              </div>
            )}
          </div>

          {/* Nav Links selection */}
          <nav className="space-y-1 flex-1 overflow-y-auto" id="sidebar-nav-container">
            {!isUserAdmin ? (
              // STUDENT TABS LIST
              <>
                <button
                  id="tab-dashboard"
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Saku</span>
                </button>

                <button
                  id="tab-transaksi"
                  onClick={() => {
                    setActiveTab('transaksi');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'transaksi' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span>Transaksi & Kategori</span>
                </button>

                <button
                  id="tab-laporan"
                  onClick={() => {
                    setActiveTab('laporan');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'laporan' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Laporan & Grafik</span>
                </button>

                <button
                  id="tab-tabungan"
                  onClick={() => {
                    setActiveTab('tabungan');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'tabungan' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Database className="w-4 h-4 shrink-0" />
                  <span>Target Tabungan</span>
                </button>

                <button
                  id="tab-notifikasi"
                  onClick={() => {
                    setActiveTab('notifikasi');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'notifikasi' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bell className="w-4 h-4 shrink-0" />
                  <span>Set Alarm & Laporan</span>
                </button>

                <button
                  id="tab-bantuan"
                  onClick={() => {
                    setActiveTab('bantuan');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'bantuan' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Pusat FAQ & Bantuan</span>
                </button>

                <button
                  id="tab-profil"
                  onClick={() => {
                    setActiveTab('profil');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === 'profil' ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 border border-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Profil & Pengaturan</span>
                </button>
              </>
            ) : (
              // ADMINISTRATOR TABS LIST
              <>
                <button
                  id="tab-admin"
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer bg-amber-600/80 text-white shadow-lg shadow-amber-500/10 border border-white/10`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Kelola User & Monitor</span>
                </button>

                {/* Sub-shortcut to test student view toggle */}
                <button
                  id="tab-switch-to-student"
                  onClick={() => {
                    handleQuickDemoLogin('student');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 mt-4 rounded-xl text-[10px] font-bold text-slate-350 hover:text-white hover:bg-white/10 border border-dashed border-white/20 uppercase transition"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Mode Mahasiswa (Demo)</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Bottom Profile and Exit trigger (Screen 16) */}
        <div className="pt-4 border-t border-white/10 space-y-3.5" id="sidebar-footer">
          <div className="flex items-center gap-3 px-1">
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-xl border border-white/15 object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-105 text-slate-100 block truncate">{profile.name}</span>
              <span className="text-[10px] text-slate-450 text-slate-400 block truncate">{profile.email}</span>
            </div>
          </div>

          <button
            id="btn-sidebar-logout"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" /> Keluar Sesi Aman
          </button>
        </div>
      </aside>

      {/* VIEW DECK PAGE BODY CONTAINER */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto" id="monevy-views-viewport">
        {renderContent()}
      </main>

      {/* SCREEN 16 LOGOUT CONFIRMATION DIALOG MODAL */}
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" id="logout-confirm-modal">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl w-full max-w-sm shadow-2xl border border-white/10 overflow-hidden text-center p-6 space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 text-center">
              <h2 className="text-lg font-bold text-slate-100">Ubah & Tutup Sesi Aman Monevy</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Apakah Anda benar-benar yakin ingin keluar? Seluruh data yang tersimpan secara lokal tetap dicadangkan secara offline di browser Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                id="btn-logout-cancel"
                onClick={() => setLogoutModalOpen(false)}
                className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Kembali
              </button>
              <button
                id="btn-logout-confirm"
                onClick={handleLogout}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Ya, Keluar Sesi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
