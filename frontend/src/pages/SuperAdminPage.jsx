import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import AddCarModal from '../components/AddCarModal'
import { SENEGAL_REGIONS } from '../data/regions'
import '../styles/admin.css'

const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const fuelIcon = f => f === 'electric' ? '⚡' : f === 'hybrid' ? '🌿' : '⛽'

const STAT_DEFS = [
  { key: 'totalAdmins', label: 'Total Admins', icon: '👤' },
  { key: 'totalCars', label: 'Total Cars', icon: '🚗' },
  { key: 'totalBookings', label: 'Total Bookings', icon: '📋' },
  { key: 'totalRevenue', label: 'Revenue', icon: '💰', fmt: v => '$' + v.toLocaleString() },
]

export default function SuperAdminPage({ navigate, showToast }) {
const { currentUser, logout } = useAuth()
const [stats, setStats] = useState(null)
const [admins, setAdmins] = useState([])
const [bookings, setBookings] = useState([])
const [cars, setCars] = useState([])
const [loading, setLoading] = useState(true)
const [showAddAdmin, setShowAddAdmin] = useState(false)
const [selectedAdminId, setSelectedAdminId] = useState(null)
const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', fleetName: '', region: 'dakar' })

// View a specific admin's fleet data
const viewAdminFleet = (adminId) => {
  setSelectedAdminId(adminId)
  // Filter to show only this admin's cars and bookings
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearSelectedAdmin = () => {
  setSelectedAdminId(null)
}

// Get data for selected admin
const selectedAdminCars = selectedAdminId 
  ? cars.filter(c => c.adminId?._id === selectedAdminId || c.adminId === selectedAdminId)
  : cars
  
const selectedAdminBookings = selectedAdminId
  ? bookings.filter(b => {
      const carBelongsToAdmin = cars.some(c => 
        (c._id === b.carId || c._id === b.carId?._id) && 
        (c.adminId === selectedAdminId || c.adminId?._id === selectedAdminId)
      )
      return carBelongsToAdmin
    })
  : bookings

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'superadmin') { 
      navigate('home'); return 
    }
    load()
  }, [currentUser])

  const load = async () => {
    setLoading(true)
    try {
      const [s, a, b, c] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/admins'),
        apiFetch('/admin/bookings'),
        apiFetch('/admin/cars'),
      ])
      setStats(s)
      setAdmins(a)
      setBookings(b)
      setCars(c)
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteAdmin = async (id) => {
    if (!confirm('Delete this admin and all their cars? This cannot be undone.')) return
    try {
      await apiFetch('/admin/admins/' + id, { method: 'DELETE' })
      showToast('Admin removed', 'success')
      load()
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  const createAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      showToast('All fields are required', 'error')
      return
    }
    try {
      await apiFetch('/admin/admins', {
        method: 'POST',
        body: JSON.stringify(newAdmin),
      })
      showToast('Admin created', 'success')
      setShowAddAdmin(false)
      setNewAdmin({ name: '', email: '', password: '', fleetName: '' })
      load()
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  if (loading) return <div className="page active"><div className="loading"><div className="spinner" />Loading dashboard...</div></div>

  const displayCars = selectedAdminId ? selectedAdminCars : cars
  const displayBookings = selectedAdminId ? selectedAdminBookings : bookings
  const displayTitle = selectedAdminId 
    ? `Fleet View: ${admins.find(a => a.id === selectedAdminId)?.name || 'Admin'}`
    : 'Super Admin Dashboard'
  const displaySubtitle = selectedAdminId
    ? `Managing fleet: ${admins.find(a => a.id === selectedAdminId)?.fleetName || ''}`
    : 'Manage all admins, fleets, and bookings across the platform.'

  return (
    <div className="page active">
      <div className="page-inner" style={{ maxWidth: '1200px' }}>
        {selectedAdminId && (
          <button className="btn-back" onClick={clearSelectedAdmin} style={{ marginBottom: '1rem' }}>
            ← Back to All Fleets
          </button>
        )}
        <h1 className="page-title">{displayTitle}</h1>
        <p className="page-subtitle">{displaySubtitle}</p>

        {/* Stats */}
        <div className="stats-grid">
          {STAT_DEFS.map(s => (
            <div key={s.key} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-value">
                {s.fmt ? s.fmt(stats?.[s.key] ?? 0) : stats?.[s.key] ?? 0}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Admins Management */}
        <h3 className="admin-section-title">Fleet Admins</h3>
        <div className="admin-fleet-header">
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Manage admins who operate their own fleets</p>
          <button className="btn-gold" onClick={() => setShowAddAdmin(true)}>+ Add Admin</button>
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Fleet Name</th><th>Region</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">No admins yet</td></tr>
              ) : admins.map(admin => (
                <tr key={admin.id}>
                  <td><strong>{admin.name}</strong></td>
                  <td>{admin.email}</td>
                  <td>{admin.fleetName}</td>
                  <td>{SENEGAL_REGIONS.find(r => r.id === admin.region)?.name || admin.region || 'Not set'}</td>
                  <td>
                    <button 
                      className="btn-primary" 
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => viewAdminFleet(admin.id)}
                    >
                      View Fleet
                    </button>
                    <button className="btn-cancel" onClick={() => deleteAdmin(admin.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All Cars */}
        <div className="admin-fleet-header">
          <h3 className="admin-section-title">{selectedAdminId ? "Admin's Cars" : "All Cars (All Fleets)"}</h3>
          {!selectedAdminId && (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Click "View Fleet" on any admin to see their specific data
            </p>
          )}
        </div>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th><th>Owner</th><th>Category</th><th>Price/Day</th>
                <th>Fuel</th><th>Available</th>
              </tr>
            </thead>
            <tbody>
              {displayCars.length === 0 ? (
                <tr><td colSpan={6} className="table-empty">No cars yet</td></tr>
              ) : displayCars.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.make} {c.model}</strong>{' '}
                    <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{c.year}</span>
                  </td>
                  <td>{c.adminId?.name || 'Unknown'}</td>
                  <td><span className="car-category">{c.category}</span></td>
                  <td style={{ color: 'var(--gold)' }}>${c.pricePerDay}</td>
                  <td>{fuelIcon(c.fuel)} {c.fuel}</td>
                  <td>
                    <span className={`badge ${c.available ? 'badge-confirmed' : 'badge-cancelled'}`}>
                      {c.available ? 'Available' : 'Rented'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All Bookings */}
        <h3 className="admin-section-title">{selectedAdminId ? "Admin's Bookings" : "All Bookings"}</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th><th>Car</th><th>Owner</th><th>Dates</th>
                <th>Days</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayBookings.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">No bookings yet</td></tr>
              ) : displayBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {b.id.slice(0, 8)}...
                  </td>
                  <td>{b.carId?.make} {b.carId?.model}</td>
                  <td>{b.carId?.adminId?.name || 'Unknown'}</td>
                  <td>{fmtDate(b.startDate)} → {fmtDate(b.endDate)}</td>
                  <td>{b.days}d</td>
                  <td style={{ color: 'var(--gold)' }}>${b.totalPrice}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal-backdrop open" onClick={e => e.target === e.currentTarget && setShowAddAdmin(false)}>
          <div className="modal" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Admin</h2>
              <button className="modal-close" onClick={() => setShowAddAdmin(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="John Doe" value={newAdmin.name}
                  onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="admin@example.com" value={newAdmin.email}
                  onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Min 6 characters" value={newAdmin.password}
                  onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Fleet Name</label>
                <input type="text" placeholder="e.g. Premium Fleet" value={newAdmin.fleetName}
                  onChange={e => setNewAdmin({ ...newAdmin, fleetName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Region</label>
                <select value={newAdmin.region} onChange={e => setNewAdmin({ ...newAdmin, region: e.target.value })}>
                  {SENEGAL_REGIONS.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setShowAddAdmin(false)}>Cancel</button>
              <button className="btn-primary" onClick={createAdmin}>Create Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
