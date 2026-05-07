import { useState } from 'react'
import { SENEGAL_REGIONS } from '../data/regions'
import { apiFetch } from '../api'
import RegionSelector from '../components/RegionSelector'
import CarCard from '../components/CarCard'
import { useAuth } from '../context/AuthContext'
import '../styles/fleet.css'

export default function RegionsPage({ showToast, openModal, navigate }) {
  const { currentUser } = useAuth()
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [admins, setAdmins] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)

  const handleRegionSelect = async (regionId) => {
    setSelectedRegion(regionId)
    setLoading(true)
    try {
      console.log('Loading region:', regionId)
      const [adminsData, carsData] = await Promise.all([
        apiFetch(`/admin/regions/${regionId}/admins`),
        apiFetch(`/admin/regions/${regionId}/cars`),
      ])
      console.log('Admins in region:', adminsData)
      console.log('Cars in region:', carsData)
      setAdmins(adminsData)
      setCars(carsData)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      showToast(e.message, 'error')
      console.error('Error loading region:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedRegion(null)
    setAdmins([])
    setCars([])
  }

  const handleBook = (car) => {
    if (!currentUser) { 
      openModal('login')
      return 
    }
    // Navigate to fleet page with car selected
    // Or open booking modal directly
  }

  return (
    <div className="page active">
      {selectedRegion ? (
        <div className="region-view">
          <button className="btn-back" onClick={handleBack}>
            ← Back to Regions
          </button>
          
          <div className="section-header">
            <p className="section-label">Fleets in Region</p>
            <h2 className="section-title">
              {SENEGAL_REGIONS.find(r => r.id === selectedRegion)?.name}
            </h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner" />
              Loading fleets...
            </div>
          ) : admins.length === 0 ? (
            <div className="empty-state">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3>No fleets in this region yet</h3>
              <p>Be the first to add a fleet here!</p>
            </div>
          ) : (
            <>
              {/* Admins/Fleets Section */}
              <div className="admins-section">
                <h3 className="section-subtitle">Available Fleets</h3>
                <div className="admins-grid">
                  {admins.map(admin => (
                    <div key={admin.id} className="admin-card">
                      <div className="admin-header">
                        <div className="admin-avatar">
                          {admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="admin-info">
                          <h4 className="admin-name">{admin.name}</h4>
                          <p className="admin-fleet">{admin.fleetName}</p>
                        </div>
                      </div>
                      
                      {/* Cars for this admin */}
                      <div className="admin-cars">
                        {cars
                          .filter(car => {
                            const carAdminId = car.adminId?._id || car.adminId
                            const adminId = admin._id || admin.id
                            return carAdminId === adminId
                          })
                          .map(car => (
                            <CarCard 
                              key={car.id} 
                              car={car} 
                              onBook={handleBook} 
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <RegionSelector onSelect={handleRegionSelect} />
      )}
    </div>
  )
}
