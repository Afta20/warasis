// Default data for the WarAsis system
// This simulates a database using localStorage

export const DEFAULT_SCHEDULES = [
  {
    id: 'slot-1',
    day: 'Senin',
    time: '08:00 - 10:00',
    assistant: 'Kak Rina',
    room: 'Lab A',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-2',
    day: 'Senin',
    time: '10:00 - 12:00',
    assistant: 'Kak Dimas',
    room: 'Lab B',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-3',
    day: 'Senin',
    time: '13:00 - 15:00',
    assistant: 'Kak Sari',
    room: 'Lab A',
    capacity: 10,
    enrolled: [],
  },
  {
    id: 'slot-4',
    day: 'Selasa',
    time: '08:00 - 10:00',
    assistant: 'Kak Budi',
    room: 'Lab C',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-5',
    day: 'Selasa',
    time: '10:00 - 12:00',
    assistant: 'Kak Rina',
    room: 'Lab A',
    capacity: 10,
    enrolled: [],
  },
  {
    id: 'slot-6',
    day: 'Selasa',
    time: '13:00 - 15:00',
    assistant: 'Kak Dimas',
    room: 'Lab B',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-7',
    day: 'Rabu',
    time: '08:00 - 10:00',
    assistant: 'Kak Sari',
    room: 'Lab A',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-8',
    day: 'Rabu',
    time: '10:00 - 12:00',
    assistant: 'Kak Budi',
    room: 'Lab C',
    capacity: 10,
    enrolled: [],
  },
  {
    id: 'slot-9',
    day: 'Rabu',
    time: '13:00 - 15:00',
    assistant: 'Kak Rina',
    room: 'Lab B',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-10',
    day: 'Kamis',
    time: '08:00 - 10:00',
    assistant: 'Kak Dimas',
    room: 'Lab A',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-11',
    day: 'Kamis',
    time: '10:00 - 12:00',
    assistant: 'Kak Sari',
    room: 'Lab C',
    capacity: 10,
    enrolled: [],
  },
  {
    id: 'slot-12',
    day: 'Kamis',
    time: '13:00 - 15:00',
    assistant: 'Kak Budi',
    room: 'Lab B',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-13',
    day: 'Jumat',
    time: '08:00 - 10:00',
    assistant: 'Kak Rina',
    room: 'Lab A',
    capacity: 10,
    enrolled: [],
  },
  {
    id: 'slot-14',
    day: 'Jumat',
    time: '10:00 - 12:00',
    assistant: 'Kak Dimas',
    room: 'Lab B',
    capacity: 12,
    enrolled: [],
  },
  {
    id: 'slot-15',
    day: 'Jumat',
    time: '13:00 - 15:00',
    assistant: 'Kak Sari',
    room: 'Lab C',
    capacity: 12,
    enrolled: [],
  },
]

export const DEFAULT_STUDENTS = [
  { nim: '2401001', name: 'Ahmad Fauzi', group: 'A' },
  { nim: '2401002', name: 'Budi Santoso', group: 'A' },
  { nim: '2401003', name: 'Citra Dewi', group: 'A' },
  { nim: '2401004', name: 'Diana Putri', group: 'B' },
  { nim: '2401005', name: 'Eko Prasetyo', group: 'B' },
  { nim: '2401006', name: 'Fitri Handayani', group: 'B' },
  { nim: '2401007', name: 'Galih Pratama', group: 'C' },
  { nim: '2401008', name: 'Hana Safitri', group: 'C' },
  { nim: '2401009', name: 'Irfan Hakim', group: 'C' },
  { nim: '2401010', name: 'Joko Widodo', group: 'D' },
  { nim: '2401011', name: 'Kartika Sari', group: 'D' },
  { nim: '2401012', name: 'Lukman Hakim', group: 'D' },
  { nim: '2401013', name: 'Maya Angelina', group: 'A' },
  { nim: '2401014', name: 'Nanda Pratiwi', group: 'A' },
  { nim: '2401015', name: 'Oscar Firmansyah', group: 'B' },
  { nim: '2401016', name: 'Putri Ayu', group: 'B' },
  { nim: '2401017', name: 'Qodir Rahman', group: 'C' },
  { nim: '2401018', name: 'Rina Marlina', group: 'C' },
  { nim: '2401019', name: 'Surya Darma', group: 'D' },
  { nim: '2401020', name: 'Tania Kusuma', group: 'D' },
  { nim: '2401021', name: 'Umar Faruq', group: 'A' },
  { nim: '2401022', name: 'Vina Anggraeni', group: 'B' },
  { nim: '2401023', name: 'Wahyu Hidayat', group: 'C' },
  { nim: '2401024', name: 'Xena Valentina', group: 'D' },
  { nim: '2401025', name: 'Yusuf Maulana', group: 'A' },
  { nim: '2401026', name: 'Zahra Nabila', group: 'B' },
  { nim: '2401027', name: 'Arif Budiman', group: 'C' },
  { nim: '2401028', name: 'Bella Permata', group: 'D' },
  { nim: '2401029', name: 'Cahya Ramadhan', group: 'A' },
  { nim: '2401030', name: 'Deni Saputra', group: 'B' },
]

export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
}

// Default war config: war opens 2 minutes from now for demo purposes
export function getDefaultWarConfig() {
  const now = new Date()
  const warStart = new Date(now.getTime() + 2 * 60 * 1000) // 2 min from now
  const warEnd = new Date(now.getTime() + 62 * 60 * 1000) // 1 hour after start

  return {
    warStartTime: warStart.toISOString(),
    warEndTime: warEnd.toISOString(),
    isWarActive: false,
    maxSwaps: 1,
  }
}

// LocalStorage helpers
const STORAGE_KEYS = {
  SCHEDULES: 'warasis_schedules',
  STUDENTS: 'warasis_students',
  WAR_CONFIG: 'warasis_war_config',
  CURRENT_USER: 'warasis_current_user',
  WAR_LOG: 'warasis_war_log',
  ADMIN_SESSION: 'warasis_admin_session',
}

export function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(DEFAULT_SCHEDULES))
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WAR_CONFIG)) {
    localStorage.setItem(STORAGE_KEYS.WAR_CONFIG, JSON.stringify(getDefaultWarConfig()))
  }
  if (!localStorage.getItem(STORAGE_KEYS.WAR_LOG)) {
    localStorage.setItem(STORAGE_KEYS.WAR_LOG, JSON.stringify([]))
  }
}

export function getSchedules() {
  const data = localStorage.getItem(STORAGE_KEYS.SCHEDULES)
  return data ? JSON.parse(data) : DEFAULT_SCHEDULES
}

export function saveSchedules(schedules) {
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules))
}

export function getStudents() {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS)
  return data ? JSON.parse(data) : DEFAULT_STUDENTS
}

export function saveStudents(students) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students))
}

export function getWarConfig() {
  const data = localStorage.getItem(STORAGE_KEYS.WAR_CONFIG)
  return data ? JSON.parse(data) : getDefaultWarConfig()
}

export function saveWarConfig(config) {
  localStorage.setItem(STORAGE_KEYS.WAR_CONFIG, JSON.stringify(config))
}

export function getCurrentUser() {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function getWarLog() {
  const data = localStorage.getItem(STORAGE_KEYS.WAR_LOG)
  return data ? JSON.parse(data) : []
}

export function addWarLog(entry) {
  const log = getWarLog()
  log.push({ ...entry, timestamp: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEYS.WAR_LOG, JSON.stringify(log))
}

export function getAdminSession() {
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION)
  return data ? JSON.parse(data) : null
}

export function saveAdminSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session))
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION)
  }
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  initializeData()
}

export function enrollStudent(slotId, studentNim) {
  const schedules = getSchedules()
  const students = getStudents()
  const student = students.find(s => s.nim === studentNim)

  if (!student) return { success: false, message: 'Mahasiswa tidak ditemukan' }

  // Check if student already enrolled in any slot
  const alreadyEnrolled = schedules.find(s => s.enrolled.includes(studentNim))
  if (alreadyEnrolled) {
    return { success: false, message: `Kamu sudah terdaftar di slot ${alreadyEnrolled.day} ${alreadyEnrolled.time}` }
  }

  const slot = schedules.find(s => s.id === slotId)
  if (!slot) return { success: false, message: 'Slot tidak ditemukan' }

  if (slot.enrolled.length >= slot.capacity) {
    return { success: false, message: 'Slot sudah penuh!' }
  }

  slot.enrolled.push(studentNim)
  saveSchedules(schedules)

  addWarLog({
    type: 'enroll',
    studentNim,
    studentName: student.name,
    slotId,
    slotInfo: `${slot.day} ${slot.time} - ${slot.assistant}`,
  })

  return { success: true, message: `Berhasil memilih slot ${slot.day} ${slot.time} dengan ${slot.assistant}!` }
}

export function unenrollStudent(studentNim) {
  const schedules = getSchedules()
  const slot = schedules.find(s => s.enrolled.includes(studentNim))

  if (!slot) return { success: false, message: 'Kamu belum terdaftar di slot manapun' }

  slot.enrolled = slot.enrolled.filter(nim => nim !== studentNim)
  saveSchedules(schedules)

  return { success: true, message: 'Berhasil keluar dari slot' }
}

export function getStudentSlot(studentNim) {
  const schedules = getSchedules()
  return schedules.find(s => s.enrolled.includes(studentNim)) || null
}

export function getWarStatus() {
  const config = getWarConfig()
  const now = new Date()
  const start = new Date(config.warStartTime)
  const end = new Date(config.warEndTime)

  if (now < start) return 'waiting'
  if (now >= start && now <= end) return 'active'
  return 'ended'
}

// Bot war simulation for live demo
export function simulateRandomEnrollment(count = 1) {
  const schedules = getSchedules()
  const students = getStudents()

  // Find students who haven't enrolled yet
  const unenrolledStudents = students.filter(student => 
    !schedules.some(slot => slot.enrolled.includes(student.nim))
  )

  if (unenrolledStudents.length === 0) {
    return { success: false, message: 'Semua mahasiswa sudah terdaftar di slot!' }
  }

  let enrolledCount = 0
  const shuffledStudents = [...unenrolledStudents].sort(() => 0.5 - Math.random())

  for (let i = 0; i < Math.min(count, shuffledStudents.length); i++) {
    const student = shuffledStudents[i]
    // Find slots that still have room
    const availableSlots = schedules.filter(s => s.enrolled.length < s.capacity)
    if (availableSlots.length === 0) break

    // Pick a random available slot
    const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)]
    randomSlot.enrolled.push(student.nim)
    enrolledCount++

    addWarLog({
      type: 'enroll',
      studentNim: student.nim,
      studentName: student.name,
      slotId: randomSlot.id,
      slotInfo: `${randomSlot.day} ${randomSlot.time} - ${randomSlot.assistant} (Simulasi)`,
    })
  }

  saveSchedules(schedules)
  return { success: true, count: enrolledCount }
}

