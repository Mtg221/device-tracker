import '../styles/hero.css'

const features = [
  {
    icon: '🏎️',
    title: 'Curated Fleet',
    text: "Hand-selected vehicles from the world's most prestigious manufacturers. Every car is meticulously maintained.",
  },
  {
    icon: '🛡️',
    title: 'Full Insurance',
    text: 'Comprehensive coverage options available. Drive with complete peace of mind on every journey.',
  },
  {
    icon: '⚡',
    title: 'Instant Booking',
    text: 'Book in under 2 minutes. Confirmation sent immediately. Vehicle ready when you are.',
  },
  {
    icon: '🌍',
    title: 'Unlimited Miles',
    text: 'Most vehicles come with unlimited mileage. Explore freely without watching the odometer.',
  },
]

export default function HomePage({ navigate, openModal }) {
  const handleNavigate = () => navigate?.('fleet')
  const handleRegister = () => openModal?.('register')

  return (
    <div className="page active">
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge">✦ Premium Car Rental Experience</div>

          <h1 className="hero-title">
            Drive Your <em>Dream</em> Today
          </h1>

          <p className="hero-subtitle">
            From sleek supercars to refined luxury sedans — curated for those who demand nothing less than extraordinary.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={handleNavigate}>
              Explore Fleet
            </button>
            <button className="btn-outline" onClick={handleRegister}>
              Join DriveElite
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>150+</strong>
            <small>Vehicles</small>
          </div>
          <div className="hero-stat">
            <strong>24/7</strong>
            <small>Support</small>
          </div>
          <div className="hero-stat">
            <strong>50k+</strong>
            <small>Happy Clients</small>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <p className="section-label">Why Choose Us</p>
          <h2 className="section-title">The Elite Difference</h2>
        </div>

        <div className="features-grid">
          {features.map((f, index) => (
            <div key={`${f.title}-${index}`} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}