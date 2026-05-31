/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Mail, 
  ChevronRight, 
  ChevronDown, 
  User, 
  Send 
} from 'lucide-react';

export function FAQSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Chat conversation logs state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { sender: 'bot', text: 'Halo! Saya asisten virtual Monevy. Ada yang bisa dibantu mengenai pembukuan keuangan bulanan Anda?', time: '09:00' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: 'Bagaimana cara menambah rincian transaksi baru?',
      a: 'Anda dapat menekan tombol hijau "Tambah Pemasukan" atau tombol merah "Tambah Pengeluaran" di Dashboard maupun tab Transaksi. Isi formulir nominal, pilih kategori yang relevan, serta catatkan deskripsinya lalu klik "Simpan".'
    },
    {
      q: 'Bagaimana cara membagi persentase budget bulanan Anda?',
      a: 'Disarankan membagi anggaran menggunakan model amplop digital di menu "Target Tabungan". Misalnya, Kas Kost: 500rb, Kebutuhan Makan: 600rb, Buku Kuliah: 150rb, dan tabungan sisa Laptop Baru: 250rb.'
    },
    {
      q: 'Bagaimana cara ekspor data rekapitulasi ke Excel/PDF?',
      a: 'Akses menu "Laporan" pada bilah navigasi utama, lalu klik tombol biru "Ekspor Laporan". Sistem akan otomatis memproses ringkasan dalam format digital siap cetak.'
    },
    {
      q: 'Apakah data keuangan saya aman di Monevy?',
      a: 'Tentu saja! Monevy menyimpan seluruh data Anda secara terenkripsi dan eksklusif di memori lokal (localStorage) browser Anda. Tim admin/STT-NF tidak memiliki akses eksternal ke data personal Anda.'
    }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setChatInput('');

    // Simulated automated smart reply from bot
    setTimeout(() => {
      let reply = 'Maaf, saya sedang memproses pertanyaan Anda. Untuk bantuan darurat, Anda bisa mengirim surel ke syifafauzianrrr@gmail.com.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('cair') || lower.includes('rekap') || lower.includes('dana')) {
        reply = 'Pertanyaan bagus! Pengeluaran bulanan biasanya ideal dikelompokkan per minggu. Monevy sangat merekomendasikan menyalakan alarm "Cek Budget" di menu Notifikasi.';
      } else if (lower.includes('tambah') || lower.includes('catat')) {
        reply = 'Untuk mencatatkan pengeluaran baru, gunakan bilah aksi cepat "+ Tambah Pengeluaran" di mana saja!';
      } else if (lower.includes('target') || lower.includes('tabungan')) {
        reply = 'Di menu Target Tabungan, Anda bisa memasukkan progress teranyar dengan menekan tombol "Tambah Tabungan" lalu mengisi nominal rupiahnya.';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: reply, time: timeNow }]);
    }, 1200);
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn" id="monevy-faq-hub">
      {/* FAQ Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pusat Bantuan & Layanan FAQ</h1>
        <p className="text-xs text-slate-500">Mencari jawaban atau butuh bantuan dalam mengatur keuangan perkuliahan?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="faq-body-grid">
        {/* Left Column: FAQ Search & Accordion (Screen 14) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5" id="faq-accordion-panel">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-emerald-600" /> FAQ Pertanyaan Populer
          </h3>

          {/* Search FAQ */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Cari kendala atau panduan monevy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs"
            />
          </div>

          {/* FAQ Accordions lists */}
          <div className="space-y-2.5">
            {filteredFAQs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-slate-100 rounded-2xl overflow-hidden transition"
                id={`faq-row-${idx}`}
              >
                <button
                  id={`faq-question-btn-${idx}`}
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-705 text-slate-700 transition cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  {activeFAQ === idx ? (
                    <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  )}
                </button>
                {activeFAQ === idx && (
                  <div className="p-4 bg-white text-xs text-slate-550 text-slate-600 leading-relaxed border-t border-slate-50 animate-slideDown">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold" id="faq-not-found">
                Tidak ada panduan terkait kata kunci pencarian Anda.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Chat simulator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-[450px] overflow-hidden" id="faq-interactive-chat">
          <div className="space-y-1 pb-3 border-b border-slate-50 shrink-0">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <MessageSquare className="w-4.5 h-4.5 text-emerald-600" /> Robot Asisten Live Chat
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold block">● LAYANAN AKTIF 24 JAM</span>
          </div>

          {/* Chat Window Message Logs */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs" id="chat-scroller">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {msg.sender === 'user' ? 'ME' : 'MV'}
                </div>

                <div className={`p-3 rounded-2xl relative ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                  <span className={`text-[8.5px] block mt-1 text-right font-bold ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input form drawer */}
          <form onSubmit={handleSendChat} className="flex gap-2 border-t border-slate-100 pt-3 shrink-0" id="chat-input-form">
            <input
              id="live-chat-input"
              type="text"
              placeholder="Tanyakan sesuatu (pencatatan, budget)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl text-xs font-semibold"
            />
            <button
              id="live-chat-send-btn"
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
