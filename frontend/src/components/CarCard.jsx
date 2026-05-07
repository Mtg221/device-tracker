import '../styles/fleet.css'

const seatIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const gearIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
)
const fuelIcon = (f) => f === 'electric' ? '⚡' : f === 'hybrid' ? '🌿' : '⛽'

export default function CarCard({ car, onBook }) {
  return (
    <div className="car-card" onClick={() => onBook(car.id)}>
      <img className="car-img" src={car.image} alt={`${car.make} ${car.model}`} loading="lazy" />
      <div className="car-body">
        <div className="car-header">
          <div>
            <div className="car-name">{car.make} {car.model}</div>
            <div className="car-year">{car.year}</div>
          </div>
          <div className="car-category">{car.category}</div>
        </div>
        <p className="car-desc">{car.description}</p>
        <div className="car-specs">
          <div className="car-spec">{seatIcon()} {car.seats} seats</div>
          <div className="car-spec">{gearIcon()} {car.transmission}</div>
          <div className="car-spec">{fuelIcon(car.fuel)} {car.fuel}</div>
        </div>
        <div className="car-footer">
          <div className="car-price">${car.pricePerDay}<small>/day</small></div>
          <button className="btn-book"
            onClick={e => { e.stopPropagation(); onBook(car.id) }}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}