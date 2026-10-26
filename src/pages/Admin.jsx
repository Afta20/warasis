import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Calendar, Users, Clock, Settings, Plus, Trash2, Edit3,
  Download, RefreshCw, LogOut, Home, Swords, BarChart3, History,
  Save, X, AlertTriangle, CheckCircle, FileText, Zap
} from 'lucide-react'
import {
  getAdminSession, saveAdminSession, getSchedules, saveSchedules,
  getStudents, saveStudents, getWarConfig, saveWarConfig, getWarLog,
  getWarStatus, resetAllData, simulateRandomEnrollment
} from '../data/store'
import { useToast } from '../context/ToastContext'
import './Admin.css'

const TABS = [
  { id: 'schedules', label: 'Jadwal', icon: Calendar },
  { id: 'students', label: 'Mahasiswa', icon: Users },
  { id: 'war-config', label: 'Pengaturan War', icon: Settings },
  { id: 'statistics', label: 'Statistik', icon: BarChart3 },
  { id: 'log', label: 'Log War', icon: History },
]

export default function Admin() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [adminSession, setAdminSession] = useState(getAdminSession())
  const [activeTab, setActiveTab] = useState('schedules')
  const [schedules, setSchedules] = useState(getSchedules())
  const [students, setStudents] = useState(getStudents())
  const [warConfig, setWarConfigState] = useState(getWarConfig())
  const [warLog, setWarLog] = useState(getWarLog())
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Schedule editing
  const [editingSlot, setEditingSlot] = useState(null)
  const [slotForm, setSlotForm] = useState({ day: 'Senin', time: '', assistant: '', room: '', capacity: 12 })

  // Student add
  const [newStudent, setNewStudent] = useState({ nim: '', name: '', group: 'A' })

  useEffect(() => {
    if (!adminSession) {
      navigate('/login?role=admin')
    }
  }, [adminSession, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      setSchedules(getSchedules())
      setStudents(getStudents())
      setWarLog(getWarLog())
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    saveAdminSession(null)
    addToast('Logout admin berhasil', 'info')
    navigate('/')
  }

  // Schedule CRUD
  const handleAddSlot = () => {
    if (!slotForm.time || !slotForm.assistant || !slotForm.room) {
      addToast('Lengkapi semua field!', 'warning')
      return
    }

    const newSlot = {
      id: `slot-${Date.now()}`,
      ...slotForm,
      capacity: parseInt(slotForm.capacity) || 12,
      enrolled: [],
    }

    const updated = [...schedules, newSlot]
    saveSchedules(updated)
    setSchedules(updated)
    setSlotForm({ day: 'Senin', time: '', assistant: '', room: '', capacity: 12 })
    addToast('Slot jadwal berhasil ditambahkan!', 'success')
  }

  const handleDeleteSlot = (slotId) => {
    const updated = schedules.filter(s => s.id !== slotId)
    saveSchedules(updated)
    setSchedules(updated)
    addToast('Slot jadwal berhasil dihapus!', 'success')
  }

  const handleEditSlot = (slot) => {
    setEditingSlot(slot.id)
    setSlotForm({
      day: slot.day,
      time: slot.time,
      assistant: slot.assistant,
      room: slot.room,
      capacity: slot.capacity,
    })
  }

  const handleSaveEditSlot = () => {
    const updated = schedules.map(s =>
      s.id === editingSlot
        ? { ...s, ...slotForm, capacity: parseInt(slotForm.capacity) || 12 }
        : s
    )
    saveSchedules(updated)
    setSchedules(updated)
    setEditingSlot(null)
    setSlotForm({ day: 'Senin', time: '', assistant: '', room: '', capacity: 12 })
    addToast('Slot jadwal berhasil diperbarui!', 'success')
  }

  // Student CRUD
  const handleAddStudent = () => {
    if (!newStudent.nim || !newStudent.name) {
      addToast('Lengkapi NIM dan Nama!', 'warning')
      return
    }
    if (students.find(s => s.nim === newStudent.nim)) {
      addToast('NIM sudah terdaftar!', 'error')
      return
    }

    const updated = [...students, { ...newStudent }]
    saveStudents(updated)
    setStudents(updated)
    setNewStudent({ nim: '', name: '', group: 'A' })
    addToast('Mahasiswa berhasil ditambahkan!', 'success')
  }

  const handleDeleteStudent = (nim) => {
    const updated = students.filter(s => s.nim !== nim)
    saveStudents(updated)
    setStudents(updated)
    addToast('Mahasiswa berhasil dihapus!', 'success')
  }

  // War Config
  const handleSaveWarConfig = () => {
    saveWarConfig(warConfig)
    setWarConfigState(warConfig)
    addToast('Pengaturan war berhasil disimpan!', 'success')
  }

  // Export CSV with UTF-8 BOM for Microsoft Excel compatibility
  const handleExportCSV = () => {
    const headers = ['NIM', 'Nama', 'Kelompok', 'Hari', 'Waktu', 'Asisten', 'Ruangan', 'Status']
    const rows = [headers]

    students.forEach(student => {
      const slot = schedules.find(s => s.enrolled.includes(student.nim))
      rows.push([
        student.nim,
        student.name,
        student.group,
        slot ? slot.day : '-',
        slot ? slot.time : '-',
        slot ? slot.assistant : '-',
        slot ? slot.room : '-',
        slot ? 'Sudah Memilih' : 'Belum Memilih',
      ])
    })

    // Escape quotes and format CSV
    const csvContent = rows
      .map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\r\n')

    // Include UTF-8 BOM
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `warasis_pbo25_rekap_asistensi.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast('Data rekapitulasi berhasil diexport ke CSV!', 'success')
  }

  // Live War Simulation
  const handleSimulateWar = (count = 5) => {
    const res = simulateRandomEnrollment(count)
    if (res.success) {
      setSchedules(getSchedules())
      setStudents(getStudents())
      setWarLog(getWarLog())
      addToast(`⚡ Simulasi berhasil! ${res.count} mahasiswa otomatis memilih slot.`, 'success')
    } else {
      addToast(res.message || 'Gagal menjalankan simulasi', 'warning')
    }
  }

  // Reset
  const handleReset = () => {
    resetAllData()
    setSchedules(getSchedules())
    setStudents(getStudents())
    setWarConfigState(getWarConfig())
    setWarLog([])
    setShowResetConfirm(false)
    addToast('Semua data berhasil direset!', 'success')
  }

  const warStatus = getWarStatus()
  const enrolledCount = schedules.reduce((sum, s) => sum + s.enrolled.length, 0)
  const totalCapacity = schedules.reduce((sum, s) => sum + s.capacity, 0)

  if (!adminSession) return null

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <Shield size={22} />
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item" onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Ke Beranda</span>
          </button>
          <button className="sidebar-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">

          {/* Quick Stats */}
          <div className="admin-stats grid-4">
            <div className="glass-card stat-card">
              <div className="stat-value">{schedules.length}</div>
              <div className="stat-label">Slot Jadwal</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value">{students.length}</div>
              <div className="stat-label">Mahasiswa</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value">{enrolledCount}</div>
              <div className="stat-label">Sudah Memilih</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-value">{students.length - enrolledCount}</div>
              <div className="stat-label">Belum Memilih</div>
            </div>
          </div>

          {/* Tab: Schedules */}
          {activeTab === 'schedules' && (
            <div className="admin-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Kelola Jadwal</h2>
                <p className="section-subtitle">Tambah, edit, dan hapus slot jadwal asistensi</p>
              </div>

              {/* Add/Edit Form */}
              <div className="glass-card admin-form-card">
                <h3 className="form-card-title">
                  {editingSlot ? <><Edit3 size={18} /> Edit Slot</> : <><Plus size={18} /> Tambah Slot Baru</>}
                </h3>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">Hari</label>
                    <select
                      className="input-field"
                      value={slotForm.day}
                      onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value })}
                    >
                      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Waktu</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="08:00 - 10:00"
                      value={slotForm.time}
                      onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asisten</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nama asisten"
                      value={slotForm.assistant}
                      onChange={(e) => setSlotForm({ ...slotForm, assistant: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ruangan</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Lab A"
                      value={slotForm.room}
                      onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kapasitas</label>
                    <input
                      type="number"
                      className="input-field"
                      value={slotForm.capacity}
                      onChange={(e) => setSlotForm({ ...slotForm, capacity: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="form-group form-actions-inline">
                    {editingSlot ? (
                      <>
                        <button className="btn btn-primary" onClick={handleSaveEditSlot}>
                          <Save size={16} /> Simpan
                        </button>
                        <button className="btn btn-secondary" onClick={() => {
                          setEditingSlot(null)
                          setSlotForm({ day: 'Senin', time: '', assistant: '', room: '', capacity: 12 })
                        }}>
                          <X size={16} /> Batal
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={handleAddSlot}>
                        <Plus size={16} /> Tambah
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="glass-card admin-table-card">
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Hari</th>
                        <th>Waktu</th>
                        <th>Asisten</th>
                        <th>Ruangan</th>
                        <th>Kapasitas</th>
                        <th>Terisi</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map(slot => (
                        <tr key={slot.id}>
                          <td>{slot.day}</td>
                          <td><span className="table-mono">{slot.time}</span></td>
                          <td>{slot.assistant}</td>
                          <td>{slot.room}</td>
                          <td>{slot.capacity}</td>
                          <td>
                            <span className={`badge ${slot.enrolled.length >= slot.capacity ? 'badge-danger' : slot.enrolled.length >= slot.capacity * 0.75 ? 'badge-warning' : 'badge-success'}`}>
                              {slot.enrolled.length}/{slot.capacity}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditSlot(slot)}>
                                <Edit3 size={14} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSlot(slot.id)}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Students */}
          {activeTab === 'students' && (
            <div className="admin-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Kelola Mahasiswa</h2>
                <p className="section-subtitle">Tambah dan kelola daftar mahasiswa</p>
              </div>

              <div className="glass-card admin-form-card">
                <h3 className="form-card-title"><Plus size={18} /> Tambah Mahasiswa</h3>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label className="form-label">NIM</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="2401001"
                      value={newStudent.nim}
                      onChange={(e) => setNewStudent({ ...newStudent, nim: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nama mahasiswa"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kelompok</label>
                    <select
                      className="input-field"
                      value={newStudent.group}
                      onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
                    >
                      {['A', 'B', 'C', 'D'].map(g => (
                        <option key={g} value={g}>Kelompok {g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group form-actions-inline">
                    <button className="btn btn-primary" onClick={handleAddStudent}>
                      <Plus size={16} /> Tambah
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card admin-table-card">
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>NIM</th>
                        <th>Nama</th>
                        <th>Kelompok</th>
                        <th>Status Jadwal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => {
                        const slot = schedules.find(s => s.enrolled.includes(student.nim))
                        return (
                          <tr key={student.nim}>
                            <td><span className="table-mono">{student.nim}</span></td>
                            <td>{student.name}</td>
                            <td><span className="badge badge-primary">Kel. {student.group}</span></td>
                            <td>
                              {slot ? (
                                <span className="badge badge-success">
                                  {slot.day} {slot.time}
                                </span>
                              ) : (
                                <span className="badge badge-warning">Belum Memilih</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStudent(student.nim)}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: War Config */}
          {activeTab === 'war-config' && (
            <div className="admin-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Pengaturan War</h2>
                <p className="section-subtitle">Atur waktu mulai dan selesai war asistensi</p>
              </div>

              <div className="glass-card admin-form-card">
                <div className="war-config-grid">
                  <div className="form-group">
                    <label className="form-label"><Clock size={14} /> Waktu Mulai War</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={warConfig.warStartTime ? warConfig.warStartTime.slice(0, 16) : ''}
                      onChange={(e) => setWarConfigState({
                        ...warConfig,
                        warStartTime: new Date(e.target.value).toISOString()
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Clock size={14} /> Waktu Selesai War</label>
                    <input
                      type="datetime-local"
                      className="input-field"
                      value={warConfig.warEndTime ? warConfig.warEndTime.slice(0, 16) : ''}
                      onChange={(e) => setWarConfigState({
                        ...warConfig,
                        warEndTime: new Date(e.target.value).toISOString()
                      })}
                    />
                  </div>
                </div>

                <div className="war-status-display">
                  <span className="form-label">Status War Saat Ini:</span>
                  <span className={`badge ${warStatus === 'active' ? 'badge-danger' : warStatus === 'waiting' ? 'badge-warning' : 'badge-success'}`}>
                    {warStatus === 'active' ? '⚔️ Berlangsung' : warStatus === 'waiting' ? '⏳ Menunggu' : '✅ Selesai'}
                  </span>
                </div>

                <div className="form-actions-row">
                  <button className="btn btn-primary" onClick={handleSaveWarConfig}>
                    <Save size={16} /> Simpan Pengaturan
                  </button>
                  <button className="btn btn-success" onClick={handleExportCSV}>
                    <Download size={16} /> Export Hasil (CSV)
                  </button>
                  <button className="btn btn-danger" onClick={() => setShowResetConfirm(true)}>
                    <RefreshCw size={16} /> Reset Semua Data
                  </button>
                </div>
              </div>

              {/* Bot War Simulator Card */}
              <div className="admin-form-card glass-card" style={{ marginTop: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                  <Zap size={20} style={{ color: 'var(--color-primary-light)' }} />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Simulasi Traffic War Mahasiswa</h3>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                  Gunakan fitur ini untuk mendemonstrasikan secara langsung bagaimana kuota slot berkurang secara otomatis dan log war terisi seperti saat puluhan mahasiswa berebut jadwal asistensi.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={() => handleSimulateWar(1)}>
                    ⚡ Simulasikan 1 Mahasiswa
                  </button>
                  <button className="btn btn-primary" onClick={() => handleSimulateWar(5)}>
                    ⚡ Simulasikan 5 Mahasiswa
                  </button>
                  <button className="btn btn-warning" onClick={() => handleSimulateWar(10)}>
                    🚀 War Massal (10 Mahasiswa)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Statistics */}
          {activeTab === 'statistics' && (
            <div className="admin-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Statistik War</h2>
                <p className="section-subtitle">Overview distribusi pemilihan jadwal</p>
              </div>

              <div className="stats-overview glass-card">
                <h3 style={{ marginBottom: 'var(--space-lg)', fontWeight: 700 }}>Distribusi Per Slot</h3>
                <div className="distribution-list">
                  {schedules.map(slot => {
                    const ratio = slot.capacity > 0 ? (slot.enrolled.length / slot.capacity) * 100 : 0
                    return (
                      <div key={slot.id} className="distribution-item">
                        <div className="distribution-label">
                          <span className="distribution-name">{slot.day} {slot.time}</span>
                          <span className="distribution-assistant">{slot.assistant}</span>
                        </div>
                        <div className="distribution-bar-wrapper">
                          <div className="distribution-bar">
                            <div
                              className={`distribution-fill ${ratio >= 100 ? 'full' : ratio >= 75 ? 'almost' : ''}`}
                              style={{ width: `${Math.min(ratio, 100)}%` }}
                            ></div>
                          </div>
                          <span className="distribution-count">{slot.enrolled.length}/{slot.capacity}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid-2">
                <div className="glass-card stat-card" style={{ padding: 'var(--space-xl)' }}>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-3xl)' }}>
                    {totalCapacity > 0 ? Math.round((enrolledCount / totalCapacity) * 100) : 0}%
                  </div>
                  <div className="stat-label">Tingkat Keterisian</div>
                </div>
                <div className="glass-card stat-card" style={{ padding: 'var(--space-xl)' }}>
                  <div className="stat-value" style={{ fontSize: 'var(--font-size-3xl)' }}>
                    {schedules.filter(s => s.enrolled.length >= s.capacity).length}
                  </div>
                  <div className="stat-label">Slot Penuh</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Log */}
          {activeTab === 'log' && (
            <div className="admin-section animate-fade-in">
              <div className="section-header">
                <h2 className="section-title">Log War</h2>
                <p className="section-subtitle">Riwayat aktivitas pemilihan jadwal</p>
              </div>

              <div className="glass-card admin-table-card">
                {warLog.length === 0 ? (
                  <div className="empty-state">
                    <History size={48} />
                    <p>Belum ada aktivitas war</p>
                  </div>
                ) : (
                  <div className="log-list">
                    {[...warLog].reverse().map((entry, i) => (
                      <div key={i} className="log-item">
                        <div className="log-icon">
                          <CheckCircle size={16} />
                        </div>
                        <div className="log-content">
                          <span className="log-student">{entry.studentName}</span>
                          <span className="log-action">memilih</span>
                          <span className="log-slot">{entry.slotInfo}</span>
                        </div>
                        <span className="log-time">
                          {new Date(entry.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <AlertTriangle size={32} />
            </div>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>Reset Semua Data?</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              Semua data jadwal, mahasiswa, dan hasil war akan dikembalikan ke default. Tindakan ini tidak dapat dibatalkan!
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                Batal
              </button>
              <button className="btn btn-danger" onClick={handleReset}>
                <RefreshCw size={16} /> Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
