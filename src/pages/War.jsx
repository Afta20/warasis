import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Swords, Clock, Calendar, User, MapPin, Users, Filter,
  ChevronDown, LogOut, CheckCircle, XCircle, AlertTriangle, Home,
  Volume2, VolumeX
} from 'lucide-react'
import {
  getCurrentUser, getSchedules, getWarConfig, getWarStatus,
  enrollStudent, getStudentSlot, saveCurrentUser
} from '../data/store'
import {
  playTickSound, playWarStartSound, playSuccessSound, playFailSound,
  toggleMute, getMuteState
} from '../utils/audio'
import { useToast } from '../context/ToastContext'
import './War.css'

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

export default function War() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [user, setUser] = useState(getCurrentUser())
  const [schedules, setSchedules] = useState(getSchedules())
  const [warStatus, setWarStatus] = useState(getWarStatus())
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [filterDay, setFilterDay] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [mySlot, setMySlot] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMuted, setIsMuted] = useState(getMuteState())
  const prevStatusRef = useRef(warStatus)

  const handleToggleSound = () => {
    const newState = toggleMute()
    setIsMuted(newState)
    addToast(newState ? 'Suara dinonaktifkan' : 'Suara diaktifkan', 'info')
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setMySlot(getStudentSlot(user.nim))
  }, [user, navigate])

  // Refresh data and countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const status = getWarStatus()
      if (prevStatusRef.current === 'waiting' && status === 'active') {
        playWarStartSound()
      }
      prevStatusRef.current = status

      setWarStatus(status)
      setSchedules(getSchedules())

      if (user) {
        setMySlot(getStudentSlot(user.nim))
      }

      if (status === 'waiting') {
        const config = getWarConfig()
        const now = new Date()
        const start = new Date(config.warStartTime)
        const diff = start - now

        if (diff > 0) {
          const secLeft = Math.floor(diff / 1000)
          if (secLeft <= 5 && secLeft > 0) {
            playTickSound()
          }
          setCountdown({
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: secLeft % 60,
          })
        }
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [user])

  const filteredSchedules = useMemo(() => {
    let result = schedules
    if (filterDay !== 'all') {
      result = result.filter(s => s.day === filterDay)
    }
    if (filterStatus === 'available') {
      result = result.filter(s => s.enrolled.length < s.capacity)
    } else if (filterStatus === 'full') {
      result = result.filter(s => s.enrolled.length >= s.capacity)
    }
    return result
  }, [schedules, filterDay, filterStatus])

  // Group schedules by day
  const groupedByDay = useMemo(() => {
    const groups = {}
    filteredSchedules.forEach(s => {
      if (!groups[s.day]) groups[s.day] = []
      groups[s.day].push(s)
    })
    return groups
  }, [filteredSchedules])

  const getSlotStatus = (slot) => {
    const ratio = slot.enrolled.length / slot.capacity
    if (ratio >= 1) return 'full'
    if (ratio >= 0.75) return 'almost-full'
    return 'available'
  }

  const handleSelectSlot = (slot) => {
    if (warStatus !== 'active') {
      playFailSound()
      addToast('War belum dimulai!', 'warning')
      return
    }
    if (mySlot) {
      playFailSound()
      addToast('Kamu sudah memilih slot!', 'warning')
      return
    }
    if (slot.enrolled.length >= slot.capacity) {
      playFailSound()
      addToast('Slot sudah penuh!', 'error')
      return
    }
    setSelectedSlot(slot)
    setShowConfirm(true)
  }

  const handleConfirmEnroll = () => {
    if (!selectedSlot || !user) return
    setIsProcessing(true)

    setTimeout(() => {
      const result = enrollStudent(selectedSlot.id, user.nim)

      if (result.success) {
        playSuccessSound()
        addToast(result.message, 'success')
        setSchedules(getSchedules())
        setMySlot(getStudentSlot(user.nim))
      } else {
        playFailSound()
        addToast(result.message, 'error')
      }

      setShowConfirm(false)
      setSelectedSlot(null)
      setIsProcessing(false)
    }, 600)
  }

  const handleLogout = () => {
    saveCurrentUser(null)
    addToast('Berhasil logout', 'info')
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="war-page">
      {/* Header */}
      <header className="war-header">
        <div className="war-header-inner">
          <div className="war-header-left">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
              <Home size={16} />
            </button>
            <div className="war-brand">
              <Swords size={22} className="war-brand-icon" />
              <span className="war-brand-text">WarAsis</span>
            </div>
          </div>

          <div className="war-header-center">
            {warStatus === 'waiting' && (
              <div className="war-status-bar status-waiting">
                <Clock size={16} />
                <span>War dimulai dalam {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}</span>
              </div>
            )}
            {warStatus === 'active' && (
              <div className="war-status-bar status-active">
                <span className="live-dot-sm"></span>
                <span>WAR BERLANGSUNG</span>
              </div>
            )}
            {warStatus === 'ended' && (
              <div className="war-status-bar status-ended">
                <CheckCircle size={16} />
                <span>War Selesai</span>
              </div>
            )}
          </div>

          <div className="war-header-right">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0)}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-nim">{user.nim} • Kel. {user.group}</span>
              </div>
            </div>
            <button 
              className={`btn btn-secondary btn-icon ${isMuted ? 'text-muted' : ''}`} 
              onClick={handleToggleSound} 
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="war-main">
        <div className="page-container">
          {/* My Slot Info */}
          {mySlot && (
            <div className="my-slot-banner glass-card animate-fade-in-up">
              <div className="my-slot-icon">
                <CheckCircle size={24} />
              </div>
              <div className="my-slot-info">
                <h3>Jadwal Asistensi Kamu</h3>
                <p>{mySlot.day}, {mySlot.time} — <strong>{mySlot.assistant}</strong> di {mySlot.room}</p>
              </div>
              <span className="badge badge-success">Terkonfirmasi</span>
            </div>
          )}

          {/* Filters */}
          <div className="war-filters animate-fade-in-up">
            <div className="filter-group">
              <Filter size={16} />
              <span className="filter-label">Filter:</span>
            </div>

            <div className="filter-pills">
              <button
                className={`filter-pill ${filterDay === 'all' ? 'active' : ''}`}
                onClick={() => setFilterDay('all')}
              >
                Semua Hari
              </button>
              {DAYS.map(day => (
                <button
                  key={day}
                  className={`filter-pill ${filterDay === day ? 'active' : ''}`}
                  onClick={() => setFilterDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="filter-pills">
              <button
                className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Semua Status
              </button>
              <button
                className={`filter-pill ${filterStatus === 'available' ? 'active' : ''}`}
                onClick={() => setFilterStatus('available')}
              >
                Tersedia
              </button>
              <button
                className={`filter-pill ${filterStatus === 'full' ? 'active' : ''}`}
                onClick={() => setFilterStatus('full')}
              >
                Penuh
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="schedule-grid animate-fade-in-up">
            {Object.keys(groupedByDay).length === 0 ? (
              <div className="empty-state">
                <Calendar size={48} />
                <p>Tidak ada jadwal yang sesuai filter</p>
              </div>
            ) : (
              Object.entries(groupedByDay).map(([day, slots]) => (
                <div key={day} className="day-group">
                  <h3 className="day-title">
                    <Calendar size={18} />
                    {day}
                  </h3>
                  <div className="slots-list">
                    {slots.map(slot => {
                      const status = getSlotStatus(slot)
                      const isMySlot = mySlot?.id === slot.id
                      return (
                        <div
                          key={slot.id}
                          className={`slot-card glass-card ${status} ${isMySlot ? 'my-slot' : ''} ${warStatus !== 'active' || mySlot ? 'disabled' : ''}`}
                          onClick={() => handleSelectSlot(slot)}
                        >
                          <div className="slot-header">
                            <div className="slot-time">
                              <Clock size={14} />
                              {slot.time}
                            </div>
                            <span className={`badge badge-${status === 'full' ? 'danger' : status === 'almost-full' ? 'warning' : 'success'}`}>
                              {status === 'full' ? 'Penuh' : status === 'almost-full' ? 'Hampir Penuh' : 'Tersedia'}
                            </span>
                          </div>

                          <div className="slot-body">
                            <div className="slot-detail">
                              <User size={14} />
                              <span>{slot.assistant}</span>
                            </div>
                            <div className="slot-detail">
                              <MapPin size={14} />
                              <span>{slot.room}</span>
                            </div>
                          </div>

                          <div className="slot-footer">
                            <div className="slot-capacity">
                              <Users size={14} />
                              <span>{slot.enrolled.length}/{slot.capacity}</span>
                            </div>
                            <div className="capacity-bar">
                              <div
                                className="capacity-fill"
                                style={{ width: `${(slot.enrolled.length / slot.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {isMySlot && (
                            <div className="my-slot-marker">
                              <CheckCircle size={16} />
                              Slot Kamu
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && selectedSlot && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <Swords size={32} />
            </div>
            <h2 className="modal-title" style={{ textAlign: 'center' }}>Konfirmasi Pilihan</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
              Apakah kamu yakin ingin memilih slot ini?
            </p>

            <div className="confirm-slot-info glass-card">
              <div className="confirm-detail">
                <Calendar size={16} />
                <span><strong>{selectedSlot.day}</strong>, {selectedSlot.time}</span>
              </div>
              <div className="confirm-detail">
                <User size={16} />
                <span>{selectedSlot.assistant}</span>
              </div>
              <div className="confirm-detail">
                <MapPin size={16} />
                <span>{selectedSlot.room}</span>
              </div>
              <div className="confirm-detail">
                <Users size={16} />
                <span>{selectedSlot.enrolled.length}/{selectedSlot.capacity} terisi</span>
              </div>
            </div>

            <div className="confirm-warning">
              <AlertTriangle size={16} />
              <span>Pilihan tidak dapat diubah setelah dikonfirmasi!</span>
            </div>

            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                <XCircle size={18} />
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmEnroll}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Konfirmasi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
