import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swords, Clock, Users, Shield, Zap, ChevronRight, Star, Trophy, Calendar } from 'lucide-react'
import { getWarConfig, getWarStatus, getSchedules, getStudents, getCurrentUser } from '../data/store'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const [warStatus, setWarStatus] = useState('waiting')
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [stats, setStats] = useState({ totalSlots: 0, totalStudents: 0, totalCapacity: 0 })
  const user = getCurrentUser()

  useEffect(() => {
    const schedules = getSchedules()
    const students = getStudents()
    setStats({
      totalSlots: schedules.length,
      totalStudents: students.length,
      totalCapacity: schedules.reduce((sum, s) => sum + s.capacity, 0),
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const config = getWarConfig()
      const status = getWarStatus()
      setWarStatus(status)

      if (status === 'waiting') {
        const now = new Date()
        const start = new Date(config.warStartTime)
        const diff = start - now

        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          })
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleEnterWar = () => {
    if (user) {
      navigate('/war')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-grid"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Zap size={14} />
            <span>PBO — Angkatan 25</span>
          </div>

          <h1 className="hero-title animate-fade-in-up">
            <span className="hero-title-war">WAR</span>
            <span className="hero-title-asis">ASIS</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up stagger-1">
            Sistem War Jadwal Asistensi
            <br />
            <span className="hero-subtitle-highlight">Pemrograman Berorientasi Objek</span>
          </p>

          {/* Countdown */}
          <div className={`countdown-section animate-fade-in-up stagger-2 ${warStatus === 'active' ? 'war-active' : ''}`}>
            {warStatus === 'waiting' && (
              <>
                <p className="countdown-label">
                  <Clock size={16} />
                  War dimulai dalam
                </p>
                <div className="countdown-grid">
                  {[
                    { value: countdown.days, label: 'Hari' },
                    { value: countdown.hours, label: 'Jam' },
                    { value: countdown.minutes, label: 'Menit' },
                    { value: countdown.seconds, label: 'Detik' },
                  ].map((item, i) => (
                    <div key={i} className="countdown-item">
                      <span className="countdown-value">{String(item.value).padStart(2, '0')}</span>
                      <span className="countdown-unit">{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {warStatus === 'active' && (
              <div className="war-live-indicator">
                <span className="live-dot"></span>
                <span className="live-text">WAR SEDANG BERLANGSUNG!</span>
              </div>
            )}
            {warStatus === 'ended' && (
              <div className="war-ended-indicator">
                <Trophy size={20} />
                <span>War telah berakhir</span>
              </div>
            )}
          </div>

          <div className="hero-actions animate-fade-in-up stagger-3">
            <button className="btn btn-primary btn-lg hero-btn" onClick={handleEnterWar}>
              <Swords size={20} />
              {warStatus === 'active' ? 'Masuk War Sekarang!' : warStatus === 'ended' ? 'Lihat Hasil' : 'Masuk War'}
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login?role=admin')}>
              <Shield size={18} />
              Admin Panel
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        <div className="page-container">
          <div className="grid-3">
            <div className="glass-card stat-card animate-fade-in-up stagger-1">
              <div className="stat-icon">
                <Calendar size={28} />
              </div>
              <div className="stat-value">{stats.totalSlots}</div>
              <div className="stat-label">Slot Asistensi</div>
            </div>
            <div className="glass-card stat-card animate-fade-in-up stagger-2">
              <div className="stat-icon">
                <Users size={28} />
              </div>
              <div className="stat-value">{stats.totalStudents}</div>
              <div className="stat-label">Mahasiswa</div>
            </div>
            <div className="glass-card stat-card animate-fade-in-up stagger-3">
              <div className="stat-icon">
                <Star size={28} />
              </div>
              <div className="stat-value">{stats.totalCapacity}</div>
              <div className="stat-label">Total Kapasitas</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="page-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Cara Kerja War</h2>
            <p className="section-subtitle">Ikuti langkah-langkah berikut untuk memilih jadwal asistensi</p>
          </div>

          <div className="steps-grid">
            {[
              {
                step: '01',
                icon: <Shield size={32} />,
                title: 'Login',
                desc: 'Masuk menggunakan NIM dan nama lengkap yang sudah terdaftar',
              },
              {
                step: '02',
                icon: <Clock size={32} />,
                title: 'Tunggu Countdown',
                desc: 'Tunggu hingga countdown selesai dan war resmi dibuka',
              },
              {
                step: '03',
                icon: <Swords size={32} />,
                title: 'Pilih Slot',
                desc: 'Pilih slot jadwal asistensi yang tersedia secepat mungkin',
              },
              {
                step: '04',
                icon: <Trophy size={32} />,
                title: 'Selesai!',
                desc: 'Jadwal asistensi kamu sudah terkonfirmasi, lihat di dashboard',
              },
            ].map((item, i) => (
              <div key={i} className="step-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="page-container">
          <div className="footer-content">
            <div className="footer-brand">
              <Swords size={20} />
              <span>WarAsis PBO 25</span>
            </div>
            <p className="footer-text">© 2025 — Sistem War Jadwal Asistensi PBO Angkatan 25</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
