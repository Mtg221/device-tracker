import { useState } from 'react'
import Modal from './Modal'
import { apiFetch } from '../api'
import { useAuth } from '../context/AuthContext'
import { SENEGAL_REGIONS } from '../data/regions'

const INITIAL = {
  make: '', model: '', year: '', pricePerDay: '',
  category: 'luxury', seats: '', transmission: 'automatic',
  fuel: 'petrol', mileage: '', image: '', description: '', features: '',
}

export default function AddCarModal({ onClose, showToast, onAdded }) {
  const { currentUser } = useAuth()
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setError('')
    if (!form.make) return setError('Make is required.')
    if (!form.model) return setError('Model is required.')
    if (!form.year) return setError('Year is required.')
    if (!form.pricePerDay) return setError('Price per day is required.')

    const year = parseInt(form.year, 10)
    const pricePerDay = parseFloat(form.pricePerDay)
    const seats = form.seats ? parseInt(form.seats, 10) : undefined

    if (isNaN(year)) return setError('Year must be a valid number.')
    if (isNaN(pricePerDay)) return setError('Price must be a valid number.')
    if (form.seats && isNaN(seats)) return setError('Seats must be a valid number.')

    const payload = {
      make: form.make, model: form.model, year, pricePerDay,
      category: form.category, transmission: form.transmission, fuel: form.fuel,
    }
    if (seats) payload.seats = seats
    if (form.mileage) payload.mileage = form.mileage
    if (form.image) payload.image = form.image
    if (form.description) payload.description = form.description
    if (form.features) payload.features = form.features.split(',').map(f => f.trim()).filter(Boolean)

    setLoading(true)
    try {
      console.log('Submitting car with payload:', payload)
      const newCar = await apiFetch('/cars', { method: 'POST', body: JSON.stringify(payload) })
      console.log('Car added successfully:', newCar)
      onClose()
      showToast(`${newCar.make} ${newCar.model} added! 🚗`, 'success')
      if (onAdded) {
        console.log('Calling onAdded callback')
        onAdded()
      }
    } catch (e) {
      console.error('Error adding car:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const footer = (
    <>
      <button className="btn-outline" onClick={onClose}>Cancel</button>
      <button className="btn-primary" style={{ flex: 1 }} onClick={submit} disabled={loading}>
        {loading ? 'Saving...' : 'Add Vehicle'}
      </button>
    </>
  )

  return (
    <Modal title="Add New Vehicle" onClose={onClose} footer={footer} maxWidth="640px">
      <div className="form-row">
        <div className="form-group">
          <label>Make *</label>
          <input type="text" placeholder="e.g. BMW" value={form.make} onChange={set('make')} />
        </div>
        <div className="form-group">
          <label>Model *</label>
          <input type="text" placeholder="e.g. M5 Competition" value={form.model} onChange={set('model')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Year *</label>
          <input type="number" placeholder="e.g. 2024" value={form.year} onChange={set('year')} />
        </div>
        <div className="form-group">
          <label>Price Per Day ($) *</label>
          <input type="number" placeholder="e.g. 280" value={form.pricePerDay} onChange={set('pricePerDay')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={set('category')}>
            <option value="luxury">Luxury</option>
            <option value="sports">Sports</option>
            <option value="suv">SUV</option>
            <option value="electric">Electric</option>
            <option value="economy">Economy</option>
          </select>
        </div>
        <div className="form-group">
          <label>Seats</label>
          <input type="number" placeholder="e.g. 5" value={form.seats} onChange={set('seats')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Transmission</label>
          <select value={form.transmission} onChange={set('transmission')}>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="form-group">
          <label>Fuel Type</label>
          <select value={form.fuel} onChange={set('fuel')}>
            <option value="petrol">Petrol</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Mileage Limit</label>
          <input type="text" placeholder="e.g. Unlimited or 300km/day" value={form.mileage} onChange={set('mileage')} />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" placeholder="https://..." value={form.image} onChange={set('image')} />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <input type="text" placeholder="Short description..." value={form.description} onChange={set('description')} />
      </div>
      <div className="form-group">
        <label>Features (comma-separated)</label>
        <input type="text" placeholder="e.g. Heated seats, Sunroof" value={form.features} onChange={set('features')} />
      </div>
      
      {/* Region display - auto-filled from user profile */}
      <div className="form-group">
        <label>Region (Fleet Location)</label>
        <input 
          type="text" 
          value={currentUser?.region ? SENEGAL_REGIONS.find(r => r.id === currentUser.region)?.name : 'Not set'}
          disabled
          style={{ opacity: 0.7, cursor: 'not-allowed' }}
        />
        <small style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Your fleet region is set by your profile. Contact admin to change.
        </small>
      </div>
      
      {error && (
        <div style={{ 
          background: 'rgba(224,92,92,0.12)', border: '1px solid var(--danger)',
          color: 'var(--danger)', borderRadius: '8px', padding: '0.75rem 1rem',
          fontSize: '0.9rem', marginTop: '0.5rem',
        }}>
          {error}
        </div>
      )}
    </Modal>
  )
}
