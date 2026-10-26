import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn, Shield, User, Hash, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { getStudents, saveCurrentUser, DEFAULT_ADMIN, saveAdminSession } from '../data/store'
import { useToast } from '../context/ToastContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('role') === 'admin'
  const { addToast } = useToast()

  const [nim, setNim] = useState('')
  const [name, setName] = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState(isAdmin ? 'admin' : 'student')

  const handleStudentLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const students = getStudents()
      const student = students.find(
        s => s.nim === nim.trim() && s.name.toLowerCase() === name.trim().toLowerCase()
      )

      if (student) {
        saveCurrentUser(student)
        addToast(`Selamat datang, ${student.name}! 🎉`, 'success')
        navigate('/war')
      } else {
        addToast('NIM atau Nama tidak ditemukan. Pastikan data sudah benar.', 'error')
      }
      setIsLoading(false)
    }, 800)
  }

  const handleAdminLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      if (adminUser === DEFAULT_ADMIN.username && adminPass === DEFAULT_ADMIN.password) {
        saveAdminSession({ username: adminUser, loggedInAt: new Date().toISOString() })
        addToast('Login admin berhasil! 🔐', 'success')
        navigate('/admin')
      } else {
        addToast('Username atau password admin salah!', 'error')
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="login-page">
      <div className="login-bg-effects">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-container animate-fade-in-up">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Kembali
        </button>

        <div className="login-header">
          <div className="login-icon-wrapper">
            {tab === 'student' ? <User size={28} /> : <Shield size={28} />}
          </div>
          <h1 className="login-title">
            {tab === 'student' ? 'Login Mahasiswa' : 'Login Admin'}
          </h1>
          <p className="login-subtitle">
            {tab === 'student'
              ? 'Masuk untuk memilih jadwal asistensi PBO'
              : 'Akses panel admin untuk mengelola war'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'student' ? 'active' : ''}`}
            onClick={() => setTab('student')}
          >
            <User size={16} />
            Mahasiswa
          </button>
          <button
            className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => setTab('admin')}
          >
            <Shield size={16} />
            Admin
          </button>
        </div>

        {/* Student Login Form */}
        {tab === 'student' && (
          <form className="login-form" onSubmit={handleStudentLogin}>
            <div className="form-group">
              <label className="form-label">
                <Hash size={14} />
                NIM (Nomor Induk Mahasiswa)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Contoh: 2401001"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={14} />
                Nama Lengkap
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk
                </>
              )}
            </button>

            <div className="login-hint">
              <p>💡 <strong>Demo:</strong> Gunakan NIM <code>2401001</code> dan nama <code>Ahmad Fauzi</code></p>
            </div>
          </form>
        )}

        {/* Admin Login Form */}
        {tab === 'admin' && (
          <form className="login-form" onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label className="form-label">
                <User size={14} />
                Username
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Username admin"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Shield size={14} />
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Password admin"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <Shield size={18} />
                  Masuk Admin
                </>
              )}
            </button>

            <div className="login-hint">
              <p>💡 <strong>Demo:</strong> Username <code>admin</code> / Password <code>admin123</code></p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
