/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  FileText, 
  Plus, 
  Trash2, 
  Square, 
  Check, 
  ChevronRight,
  BookOpen,
  MapPin,
  Clock,
  User,
  Activity,
  X,
  AlertCircle
} from 'lucide-react';
import { ClassSchedule, AcademicTask, AcademicNote } from '../types';

interface AcademicCompanionProps {
  schedules: ClassSchedule[];
  tasks: AcademicTask[];
  notes: AcademicNote[];
  onAddTask: (task: Omit<AcademicTask, 'id'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddSchedule: (sch: Omit<ClassSchedule, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
  onAddNote: (note: Omit<AcademicNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

export function AcademicCompanion({
  schedules,
  tasks,
  notes,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSchedule,
  onDeleteSchedule,
  onAddNote,
  onDeleteNote
}: AcademicCompanionProps) {
  // Navigation tabs for Companion
  const [activeSubTab, setActiveSubTab] = useState<'jadwal' | 'tugas' | 'catatan'>('jadwal');

  // Addition Modal/State handlers
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
  const [taskDesc, setTaskDesc] = useState('');

  const [isSchOpen, setIsSchOpen] = useState(false);
  const [schSubject, setSchSubject] = useState('');
  const [schDay, setSchDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');
  const [schStart, setSchStart] = useState('08:00');
  const [schEnd, setSchEnd] = useState('10:00');
  const [schRoom, setSchRoom] = useState('');
  const [schLecturer, setSchLecturer] = useState('');

  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<'Kuliah' | 'Keuangan' | 'Pribadi'>('Kuliah');
  const [noteContent, setNoteContent] = useState('');
  
  // Note viewer
  const [viewingNote, setViewingNote] = useState<AcademicNote | null>(null);

  // Submit forms
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskSubject || !taskDueDate) return;
    onAddTask({
      title: taskTitle,
      subject: taskSubject,
      dueDate: taskDueDate,
      priority: taskPriority,
      completed: false,
      description: taskDesc
    });
    setIsTaskOpen(false);
    setTaskTitle('');
    setTaskSubject('');
    setTaskDueDate('');
    setTaskPriority('Sedang');
    setTaskDesc('');
  };

  const handleSubmitSch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schSubject || !schRoom || !schLecturer) return;
    
    // Choose some aesthetic color pattern based on Day
    const colors = ['emerald', 'blue', 'indigo', 'orange', 'teal', 'violet'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddSchedule({
      subject: schSubject,
      day: schDay,
      startTime: schStart,
      endTime: schEnd,
      room: schRoom,
      lecturer: schLecturer,
      color: randomColor
    });
    setIsSchOpen(false);
    setSchSubject('');
    setSchRoom('');
    setSchLecturer('');
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    onAddNote({
      title: noteTitle,
      category: noteCategory,
      content: noteContent,
      date: new Date().toISOString().split('T')[0]
    });
    setIsNoteOpen(false);
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <div className="space-y-6" id="monevy-academic-companion">
      {/* Companion top menu header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4" id="academic-header">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ruang Pendamping Akademik</h1>
          <p className="text-xs text-slate-500">
            Terintegrasi dengan pencatatan keuangan untuk menjaga kestabilan belajar mahasiswa prestatif.
          </p>
        </div>

        {/* Dynamic sub tab navigations */}
        <div className="flex p-1 bg-slate-100 rounded-xl" id="companion-tabs-group">
          <button
            id="tab-companion-jadwal"
            onClick={() => setActiveSubTab('jadwal')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'jadwal' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            <Calendar className="w-4 h-4" /> Jadwal Kuliah
          </button>
          <button
            id="tab-companion-tugas"
            onClick={() => setActiveSubTab('tugas')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'tugas' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Tugas & To-Do
          </button>
          <button
            id="tab-companion-catatan"
            onClick={() => setActiveSubTab('catatan')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'catatan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-850'
            }`}
          >
            <FileText className="w-4 h-4" /> Catatan Pintar
          </button>
        </div>
      </div>

      {/* SUB-TAB VIEW 1: JADWAL KULIAH */}
      {activeSubTab === 'jadwal' && (
        <div className="space-y-6 animate-fadeIn" id="schedule-sub-tab">
          <div className="flex justify-between items-center bg-emerald-50/40 p-4 rounded-2xl border border-emerald-50">
            <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5" /> Kalender Jadwal Perkuliahan Aktif Semester Ini
            </span>
            <button
              id="btn-add-schedule"
              onClick={() => setIsSchOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Kelas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="schedules-grid">
            {schedules.map((sch) => (
              <div 
                key={sch.id} 
                className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 p-5 shadow-sm hover:shadow transition relative overflow-hidden group"
              >
                {/* Visual day stripe indicator at side */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-emerald-500" />
                
                <div className="pl-2 space-y-4">
                  {/* Subject Title */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {sch.day}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm mt-1.5">{sch.subject}</h4>
                    </div>
                    <button
                      id={`delete-schedule-${sch.id}`}
                      onClick={() => onDeleteSchedule(sch.id)}
                      className="p-1.5 text-slate-350 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Fact parameters */}
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Jam {sch.startTime} - {sch.endTime} WIB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sch.room} (Gedung Utama STT-NF)</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-50">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">Dosen: {sch.lecturer}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-16 col-span-full border border-dashed border-slate-200 rounded-2xl">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-650 text-slate-600">Belum ada mata kuliah terekam.</p>
                <p className="text-xs text-slate-400 mt-1">Ketuk tombol di atas untuk merekam jadwal kuliah mingguan Anda!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 2: MANAJEMEN TUGAS */}
      {activeSubTab === 'tugas' && (
        <div className="space-y-4 animate-fadeIn" id="tasks-sub-tab">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-550 font-semibold text-slate-500">DAFTAR KESELURUHAN TUGAS KULIAH ({tasks.length})</span>
            <button
              id="btn-add-task"
              onClick={() => setIsTaskOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Tugas Baru
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100" id="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition">
                <div className="flex items-start gap-3.5 flex-1 pr-4">
                  {/* Checkbox trigger toggle */}
                  <button
                    id={`toggle-task-${task.id}`}
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 p-0.5 rounded border flex items-center justify-center cursor-pointer transition ${
                      task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 text-transparent hover:border-slate-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </button>

                  <div className="space-y-1">
                    <span className={`font-bold text-sm block ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      🎯 {task.subject} • 📅 Batas Kumpul: {task.dueDate}
                    </span>
                    {task.description && (
                      <p className="text-xs text-slate-550 text-slate-500 leading-normal max-w-xl">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Priority badges & actions */}
                <div className="flex items-center gap-3">
                  <span className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    task.priority === 'Tinggi' ? 'bg-red-50 text-red-650 text-red-600 border border-red-100' :
                    task.priority === 'Sedang' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    id={`delete-task-${task.id}`}
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition shrink-0 cursor-pointer"
                    title="Hapus tugas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <CheckSquare className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-650 text-slate-600">Semua tugas perkuliahan beres!</p>
                <p className="text-xs mt-1">Gunakan waktu luang Anda untuk memeriksa tabungan atau membaca modul baru.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB VIEW 3: INTEGRASI CATATAN INTUITIF */}
      {activeSubTab === 'catatan' && (
        <div className="space-y-5 animate-fadeIn" id="notes-sub-tab">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">KUMPULAN CATATAN PINTAR MAHASISWA ({notes.length})</span>
            <button
              id="btn-add-note"
              onClick={() => setIsNoteOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Catatan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="notes-cards-grid">
            {notes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => setViewingNote(note)}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-250 cursor-pointer shadow-sm hover:shadow transition relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      note.category === 'Keuangan' ? 'bg-emerald-50 text-emerald-800' :
                      note.category === 'Kuliah' ? 'bg-blue-50 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {note.category}
                    </span>
                    <button
                      id={`delete-note-${note.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="p-1 px-2 text-slate-350 text-slate-400 hover:text-red-500 hover:bg-red-55 border border-transparent rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Hapus Catatan"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-sm mt-2.5 line-clamp-1">{note.title}</h3>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                  <span>Sunting: {note.date}</span>
                  <span className="text-emerald-600 inline-flex items-center gap-0.5">Baca <ChevronRight className="w-3 h-3" /></span>
                </div>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="text-center py-16 col-span-full border border-dashed border-slate-200 rounded-2xl">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-2" />
                <p className="text-sm font-semibold font-bold text-slate-600">Catatan kosong.</p>
                <p className="text-xs text-slate-400 mt-1">Tekan tombol di atas untuk menggambar peta ide atau melacak anggaran belanja!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUPS & DETAILS FOR SCH/TASK/NOTES */}
      
      {/* 1. View Note Reader Modal */}
      {viewingNote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="note-viewer-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]" id="note-viewer-modal">
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
              <span className="text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Catatan {viewingNote.category}
              </span>
              <button 
                onClick={() => setViewingNote(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <h3 className="font-extrabold text-slate-800 text-lg">{viewingNote.title}</h3>
              <p className="text-xs text-slate-400 font-semibold">Diposting pada {viewingNote.date}</p>
              <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                {viewingNote.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewingNote(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-350 bg-slate-700 hover:bg-slate-850 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Class Schedule Modal */}
      {isSchOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="add-schedule-modal-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden" id="add-schedule-modal">
            <div className="bg-emerald-600 p-5 text-white flex justify-between items-center text-sm">
              <span className="font-bold">Tambah Kelas Jadwal Kuliah</span>
              <button onClick={() => setIsSchOpen(false)} className="p-1 rounded-full hover:bg-white/20 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitSch} className="p-6 space-y-4 text-xs text-slate-600 font-medium">
              <div className="space-y-1">
                <label className="font-bold">Nama Mata Kuliah *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Thinking Kelompok 17"
                  value={schSubject}
                  onChange={(e) => setSchSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Hari</label>
                  <select
                    value={schDay}
                    onChange={(e) => setSchDay(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold">Ruangan *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R.304 / Lab 2"
                    value={schRoom}
                    onChange={(e) => setSchRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Jam Mulai</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30"
                    value={schStart}
                    onChange={(e) => setSchStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold">Jam Selesai</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30"
                    value={schEnd}
                    onChange={(e) => setSchEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Dosen Pengampu *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Misna Asqia, S.Kom., M.Kom."
                  value={schLecturer}
                  onChange={(e) => setSchLecturer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Buat Jadwal Kelas
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Task Modal */}
      {isTaskOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-emerald-600 p-5 text-white flex justify-between items-center text-sm">
              <span className="font-bold">Tambah Tugas & Kegiatan</span>
              <button onClick={() => setIsTaskOpen(false)} className="p-1 rounded-full hover:bg-white/20 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-6 space-y-4 text-xs text-slate-600 font-medium">
              <div className="space-y-1">
                <label className="font-bold">Judul Tugas *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UTS Basis Data / Kelompok Laporan DT"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold">Mata Kuliah *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basis Data"
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold">Prioritas *</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                  >
                    <option value="Rendah">Rendah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tinggi">Tinggi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Batas Tanggal Pengumpulan *</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Deskripsi Tambahan</label>
                <textarea
                  placeholder="e.g. Masukkan deskripsi ringkas tugas/soal..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Catatkan Tugas
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Notebook Note Modal */}
      {isNoteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-emerald-600 p-5 text-white flex justify-between items-center text-sm">
              <span className="font-bold">Tambah Catatan Baru</span>
              <button onClick={() => setIsNoteOpen(false)} className="p-1 rounded-full hover:bg-white/20 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSubmitNote} className="p-6 space-y-4 text-xs text-slate-600 font-medium">
              <div className="space-y-1">
                <label className="font-bold">Judul Catatan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ringkasan Belanja Sembako"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold">Kategori</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                >
                  <option value="Kuliah">Kuliah</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Pribadi">Pribadi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold">Isi Catatan Pintar *</label>
                <textarea
                  required
                  placeholder="Tulis ide-ide brilian Anda di sini..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Simpan Catatan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
