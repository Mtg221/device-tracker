import { useState, useMemo } from 'react'
import Modal from './Modal'
import { apiFetch } from '../api'
import '../styles/booking.css'

const EXTRAS = [
  { key: 'gps',       label: '🗺️ GPS Navigation', price: 10 },
  { key: 'insurance', label: '🛡️ Full Insurance',  price: 25 },
  { key: 'childSeat', label: '👶 Child Seat',       price: 15 },
  { key: 'driver',    label: '🧑‍✈️ Private Driver',  price: 80 },
]

const today    = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export default function BookingModal({ car, onClose, showToast }) {
  const [startDate, setStartDate]   = useState(today)
  const [endDate, setEndDate]       = useState(tomorrow)
  const [extras, setExtras]         = useState(new Set())
  const [loading, setLoading]       = useState(false)

  const days = Math.max(1, Math.ceil(
    (new Date(endDate) - new Date(startDate)) / 86400000
  ))

  const extrasTotal = useMemo(() =>
    [...extras].reduce((s, k) => s + (EXTRAS.find(e => e.key === k)?.price || 0), 0)
  , [extras])

  const carTotal   = car.pricePerDay * days
  const extTotal   = extrasTotal * days
  const totalPrice = carTotal + extTotal

  const toggleExtra = (key) => {
    setExtras(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const confirm = async () => {
    if (new Date(endDate) <= new Date(startDate)) {
      showToast('End date must be after start date', 'error')
      return
    }
    setLoading(true)
    try {
      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
        carId: car.id,
        car: {
          make: car.make,
          model: car.model,
          image: car.image,
          pricePerDay: car.pricePerDay,
        },
        startDate,
        endDate,
        days,
        extras: [...extras],
        extrasTotal,
        carTotal,
        totalPrice,
      }),
      })
      onClose()
      showToast('Booking confirmed! 🎉', 'success')
    } catch (e) {
      showToast(e.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <>
      <button className="btn-outline" onClick={onClose}>Cancel</button>
      <button className="btn-primary" style={{ flex: 1 }} onClick={confirm} disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </>
  )

  return (
    <Modal title="Reserve Vehicle" onClose={onClose} footer={footer} maxWidth="600px">
      <img className="car-modal-img" src={car.image} alt={`${car.make} ${car.model}`} />
      <div className="car-modal-name">{car.make} {car.model}</div>
      <div className="car-modal-sub">{car.year} · {car.category} · {car.transmission}</div>

      <div className="form-row">
        <div className="form-group">
          <label>Pick-up Date</label>
          <input type="date" value={startDate} min={today}
            onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Return Date</label>
          <input type="date" value={endDate} min={startDate}
            onChange={e => setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="form-group"><label>Add Extras</label></div>
      <div className="extras-grid">
        {EXTRAS.map(ex => (
          <div key={ex.key}
            className={`extra-item ${extras.has(ex.key) ? 'selected' : ''}`}
            onClick={() => toggleExtra(ex.key)}>
            <input type="checkbox" readOnly checked={extras.has(ex.key)} />
            <div>
              <div className="extra-label">{ex.label}</div>
              <div className="extra-price">+${ex.price}/day</div>
            </div>
          </div>
        ))}
      </div>

      <div className="booking-summary">
        <div className="summary-row">
          <span>Vehicle ({days} day{days > 1 ? 's' : ''})</span>
          <span>${carTotal}</span>
        </div>
        {extTotal > 0 && (
          <div className="summary-row"><span>Extras</span><span>${extTotal}</span></div>
        )}
        <div className="summary-row total">
          <span>Total</span>
          <span className="price">${totalPrice}</span>
        </div>
      </div>
    </Modal>
  )
}