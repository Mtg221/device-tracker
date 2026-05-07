import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api'
import '../styles/bookings.css'

const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function BookingsPage({ navigate, showToast }) {
  const { currentUser } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!currentUser) { navigate('home'); return }
    load()
  }, [currentUser])

  const load = () => {
    setLoading(true)
    apiFetch('/bookings')
      .then(setBookings)
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false))
  }

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await apiFetch('/bookings/' + id, { method: 'DELETE' })
      showToast('Booking cancelled', 'success')
      load()
    } catch (e) {
      showToast(e.message, 'error')
    }
  }

  return (
    <div className="page active">
      <div className="page-inner">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Your rental history and upcoming reservations.</p>

        {loading ? (
          <div className="loading"><div className="spinner" />Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3>No bookings yet</h3>
            <p>Explore our fleet and book your first ride.</p>
          </div>
        ) : (
          bookings.map(b => (
            <div key={b.id} className="booking-card">
              <img className="booking-car-img" src={b.car.image} alt={`${b.car.make} ${b.car.model}`} />
              <div className="booking-info">
                <div className="booking-name">{b.car.make} {b.car.model}</div>
                <div className="booking-dates">
                  📅 {fmtDate(b.startDate)} → {fmtDate(b.endDate)} · {b.days} day{b.days > 1 ? 's' : ''}
                </div>
                <div className="booking-meta">
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                  <span className="booking-price">${b.totalPrice}</span>
                </div>
              </div>
              {b.status === 'confirmed' && (
                <button className="btn-cancel" onClick={() => cancel(b.id)}>Cancel</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}