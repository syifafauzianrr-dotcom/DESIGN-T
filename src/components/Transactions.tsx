/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  Coins, 
  X, 
  Plus, 
  Tag, 
  BookOpen, 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  Gift, 
  GraduationCap,
  Filter
} from 'lucide-react';
import { Transaction, BudgetCategory } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (id: string, updated: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  selectedTx: Transaction | null;
  setSelectedTx: (tx: Transaction | null) => void;
  quickTxType: 'pemasukan' | 'pengeluaran' | null;
  setQuickTxType: (type: 'pemasukan' | 'pengeluaran' | null) => void;
}

export function Transactions({
  transactions,
  categories,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  selectedTx,
  setSelectedTx,
  quickTxType,
  setQuickTxType
}: TransactionsProps) {
  // State for filtering & searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  
  // State for Add Transaction modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
  const [addTitle, setAddTitle] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addCategory, setAddCategory] = useState('');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addNote, setAddNote] = useState('');

  // State for Editing inside detail view
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');

  // Format to IDR rupiah
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Synchronize category choices based on type selection
  const filteredCategories = categories.filter(c => c.type === (isAddOpen ? addType : 'pengeluaran'));
  const editFilteredCategories = selectedTx ? categories.filter(c => c.type === selectedTx.type) : [];

  // Handle opening add modal from external quick actions
  React.useEffect(() => {
    if (quickTxType) {
      setAddType(quickTxType);
      const matchedCat = categories.find(c => c.type === quickTxType);
      setAddCategory(matchedCat ? matchedCat.name : '');
      setAddTitle('');
      setAddAmount('');
      setAddNote('');
      setAddDate(new Date().toISOString().split('T')[0]);
      setIsAddOpen(true);
      setQuickTxType(null); // Clear trigger
    }
  }, [quickTxType, categories, setQuickTxType]);

  const handleOpenAddModal = (type: 'pemasukan' | 'pengeluaran') => {
    setAddType(type);
    const matchedCat = categories.find(c => c.type === type);
    setAddCategory(matchedCat ? matchedCat.name : '');
    setAddTitle('');
    setAddAmount('');
    setAddNote('');
    setAddDate(new Date().toISOString().split('T')[0]);
    setIsAddOpen(true);
  };

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle || !addAmount || !addCategory) return;
    
    onAddTransaction({
      title: addTitle,
      amount: Math.abs(parseFloat(addAmount)),
      type: addType,
      category: addCategory,
      date: addDate,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      catatan: addNote
    });

    setIsAddOpen(false);
  };

  const handleStartEdit = () => {
    if (!selectedTx) return;
    setEditTitle(selectedTx.title);
    setEditAmount(selectedTx.amount.toString());
    setEditCategory(selectedTx.category);
    setEditDate(selectedTx.date);
    setEditNote(selectedTx.catatan);
    setIsEditing(true);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTx || !editTitle || !editAmount) return;

    const updatedData: Partial<Transaction> = {
      title: editTitle,
      amount: Math.abs(parseFloat(editAmount)),
      category: editCategory,
      date: editDate,
      catatan: editNote
    };

    onEditTransaction(selectedTx.id, updatedData);
    
    // Update active modal display
    setSelectedTx({
      ...selectedTx,
      ...updatedData
    } as Transaction);
    
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedTx) return;
    onDeleteTransaction(selectedTx.id);
    setSelectedTx(null);
    setIsEditing(false);
  };

  // Filter transaction list
  const getFilteredTransactions = () => {
    return transactions.filter(tx => {
      const matchSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.catatan.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = filterType === 'semua' || tx.type === filterType;
      
      return matchSearch && matchType;
    });
  };

  const visibleTx = getFilteredTransactions();

  // Find corresponding category color
  const getCategoryColor = (categoryName: string) => {
    const parent = categories.find(c => c.name === categoryName);
    return parent ? parent.color : '#64748B';
  };

  return (
    <div className="space-y-6" id="monevy-transactions-interface">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="transactions-top-bar">
        <div>
          <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Riwayat Transaksi Mahasiswa</h1>
          <p className="text-xs text-slate-405 text-slate-400 font-medium">Catat setiap pengeluaran dan pemasukan Anda agar terkontrol rapi.</p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-add-pemasukan"
            onClick={() => handleOpenAddModal('pemasukan')}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-500/10 transition inline-flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4" /> Tambah Pemasukan
          </button>
          <button
            id="btn-add-pengeluaran"
            onClick={() => handleOpenAddModal('pengeluaran')}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-500/10 transition inline-flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Plus className="w-4 h-4" /> Tambah Pengeluaran
          </button>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-xl space-y-4" id="transaction-filters">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="search-transactions-input"
              type="text"
              placeholder="Cari transaksi (e.g. makan, bensin, tabungan)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-white placeholder-slate-400 transition"
            />
          </div>

          {/* Type Filters */}
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl w-fit" id="type-filter-group">
            <button
              id="filter-semua"
              onClick={() => setFilterType('semua')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'semua' ? 'bg-white/15 text-white shadow-sm border border-white/10' : 'text-slate-405 text-slate-400 hover:text-white'}`}
            >
              Semua
            </button>
            <button
              id="filter-pemasukan"
              onClick={() => setFilterType('pemasukan')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30' : 'text-slate-405 text-slate-400 hover:text-white'}`}
            >
              Pemasukan
            </button>
            <button
              id="filter-pengeluaran"
              onClick={() => setFilterType('pengeluaran')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${filterType === 'pengeluaran' ? 'bg-rose-500/20 text-rose-400 shadow-sm border border-rose-500/30': 'text-slate-405 text-slate-400 hover:text-white'}`}
            >
              Pengeluaran
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl overflow-hidden rounded-2xl animate-fadeIn" id="transactions-table-container">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center text-xs text-slate-400 font-semibold" id="table-tx-header">
          <span>MENAMPILKAN {visibleTx.length} TRANSAKSI</span>
          <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Terurut Berdasarkan Hari Terbaru</span>
        </div>
        
        <div className="divide-y divide-white/10 bg-transparent">
          {visibleTx.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="flex items-center justify-between p-4 hover:bg-white/10 transition cursor-pointer duration-200"
              id={`tx-list-row-${tx.id}`}
            >
              <div className="flex items-center gap-3">
                {/* Colored Accent Dots */}
                <span className="w-1.5 h-8 rounded-full shadow-sm" style={{ backgroundColor: getCategoryColor(tx.category) }} />
                <div>
                  <span className="font-bold text-slate-100 text-sm block">{tx.title}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-white/10 text-slate-300 uppercase text-[9px] border border-white/5">
                      {tx.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3 text-slate-400" /> {tx.date} ({tx.time})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-extrabold text-sm md:text-base ${tx.type === 'pemasukan' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
                <span className="text-slate-500 text-lg hidden sm:block">›</span>
              </div>
            </div>
          ))}

          {visibleTx.length === 0 && (
            <div className="text-center py-16 text-slate-400" id="tx-empty-state">
              <Coins className="w-12 h-12 text-slate-400 opacity-40 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">Transaksi tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Cobalah menggunakan kata kunci pencarian lain atau setel ulang filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* SCREEN 4 & 5: ADD TRANSACTION POPUP MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-fadeIn" id="add-transaction-modal-backdrop">
          <div className="bg-slate-950/80 backdrop-blur-3xl rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/15 max-h-[85vh] flex flex-col" id="add-transaction-modal">
            {/* Modal Header */}
            <div className={`p-5 text-white flex justify-between items-center ${addType === 'pemasukan' ? 'bg-emerald-500/10 border-b border-emerald-500/20' : 'bg-rose-500/10 border-b border-rose-500/20'}`}>
              <div className="space-y-0.5">
                <h3 className="font-bold text-lg bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Tambah {addType === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}</h3>
                <p className="text-xs text-slate-400">Masukkan rincian keuangan Anda secara urut</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={submitAdd} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Type selector toggle within modal */}
              <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-xl text-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAddType('pemasukan');
                    const c = categories.find(cat => cat.type === 'pemasukan');
                    if (c) setAddCategory(c.name);
                  }}
                  className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${addType === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                >
                  Pemasukan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddType('pengeluaran');
                    const c = categories.find(cat => cat.type === 'pengeluaran');
                    if (c) setAddCategory(c.name);
                  }}
                  className={`py-1.5 rounded-lg font-bold transition cursor-pointer ${addType === 'pengeluaran' ? 'bg-rose-500/20 text-rose-455 text-rose-400 shadow-sm border border-rose-500/20' : 'text-slate-400 hover:text-white'}`}
                >
                  Pengeluaran
                </button>
              </div>

              {/* Title / Name */}
              <div className="space-y-11 space-y-1">
                <label className="text-slate-350 text-xs font-bold block">Nama Transaksi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Makan nasi telur, Ongkos angkot, Uang bulanan"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 placeholder-slate-400 transition"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-slate-350 text-xs font-bold block">Jumlah Nominal (Rp) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 25000"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 placeholder-slate-400 transition"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-slate-350 text-xs font-bold block">Kategori Keuangan <span className="text-red-500">*</span></label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 font-bold"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-slate-950 text-white font-medium">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-slate-350 text-xs font-bold block">Tanggal Transaksi <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-350 text-xs font-bold block">Catatan Pendukung (Opsional)</label>
                <textarea
                  placeholder="Tulis catatan kecil, merk, kuantitas atau rincian lainnya..."
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 placeholder-slate-400 transition resize-none"
                />
              </div>

              {/* Footnote */}
              <span className="text-[10px] text-slate-450 text-slate-450 text-slate-400 block text-center italic">
                * Data akan langsung terintegrasi secara aman di memori lokal peramban Anda.
              </span>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer ${addType === 'pemasukan' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-555/10' : 'bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-555/10'}`}
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREEN 8: DETAIL TRANSAKSI POPUP MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-fadeIn" id="detail-transaction-modal-backdrop">
          <div className="bg-slate-950/85 backdrop-blur-3xl rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-white/15 max-h-[85vh] flex flex-col" id="detail-transaction-modal">
            {/* Detail Header */}
            <div className={`p-5 text-white flex justify-between items-center ${selectedTx.type === 'pemasukan' ? 'bg-emerald-555/10 bg-emerald-500/10 border-b border-emerald-500/25' : 'bg-white/5 border-b border-white/10'}`}>
              <span className="font-bold text-sm bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Monevy - Detail Transaksi</span>
              <button 
                onClick={() => {
                  setSelectedTx(null);
                  setIsEditing(false);
                }}
                className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Editing state vs Reading state */}
            {!isEditing ? (
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Big Display Tag */}
                <div className="text-center space-y-1 py-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-slate-450 text-slate-450 text-indigo-400 uppercase">{selectedTx.category}</span>
                  <h2 className={`text-2xl md:text-3.5xl font-extrabold tracking-tight ${selectedTx.type === 'pemasukan' ? 'text-emerald-400' : 'text-white'}`}>
                    {selectedTx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(selectedTx.amount)}
                  </h2>
                  <p className="text-xs font-bold text-slate-300 mt-1">{selectedTx.title}</p>
                </div>

                {/* Info Fields */}
                <div className="bg-white/5 rounded-2xl p-4.5 space-y-3.5 border border-white/10 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[10px]">Tipe Transaksi</span>
                    <span className={`px-2.5 py-0.5 rounded-md font-extrabold uppercase text-[9px] border ${
                      selectedTx.type === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-555/25' : 'bg-rose-500/20 text-rose-300 border-rose-555/25'
                    }`}>
                      {selectedTx.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[10px]">Tanggal & Waktu</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedTx.date} ({selectedTx.time || '12:00'})
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-slate-450 text-slate-400 font-semibold uppercase text-[10px] block">Catatan Tambahan</span>
                    <p className="text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                      {selectedTx.catatan || 'Tidak ada catatan tambahan untuk transaksi ini.'}
                    </p>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex gap-3 pt-3 border-t border-white/10">
                  <button
                    id="btn-delete-tx"
                    onClick={handleDelete}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-555/15 hover:bg-rose-500/10 border border-rose-500/20 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                  <button
                    id="btn-edit-tx"
                    onClick={handleStartEdit}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Data
                  </button>
                </div>
              </div>
            ) : (
              /* Editable form */
              <form onSubmit={submitEdit} className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
                {/* Editable Title */}
                <div className="space-y-1">
                  <label className="text-slate-350 text-slate-405 text-slate-400 font-bold block mb-1">Ubah Nama Transaksi</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10"
                  />
                </div>

                {/* Editable Amount */}
                <div className="space-y-1">
                  <label className="text-slate-350 text-slate-405 text-slate-400 font-bold block mb-1">Ubah Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10"
                  />
                </div>

                {/* Editable Category */}
                <div className="space-y-1">
                  <label className="text-slate-350 text-slate-405 text-slate-400 font-bold block mb-1">Ubah Kategori</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 font-bold"
                  >
                    {editFilteredCategories.map((c) => (
                      <option key={c.id} value={c.name} className="bg-slate-950 text-white font-medium">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Editable Date */}
                <div className="space-y-1">
                  <label className="text-slate-350 text-slate-405 text-slate-400 font-bold block mb-1">Ubah Tanggal</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                {/* Editable Notes */}
                <div className="space-y-1">
                  <label className="text-slate-350 text-slate-405 text-slate-400 font-bold block mb-1">Ubah Catatan</label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 resize-none animate-fadeIn"
                  />
                </div>

                {/* Edit Form Operations */}
                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition font-bold cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition font-bold cursor-pointer"
                  >
                    Terapkan Editan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
