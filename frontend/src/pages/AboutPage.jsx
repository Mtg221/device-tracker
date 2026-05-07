import '../styles/hero.css'

const highlights = [
  { icon: '📍', title: '10+ Locations',    text: 'Conveniently located across major cities and airports.' },
  { icon: '🏆', title: 'Award-Winning',    text: 'Voted #1 Premium Car Rental 3 years in a row.' },
  { icon: '📞', title: 'Concierge Service', text: 'Personal concierge available 24/7 for elite members.' },
]

export default function AboutPage() {
  return (
    <div className="page active">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div className="section-header">
          <p className="section-label">Our Story</p>
          <h2 className="section-title">About DriveElite</h2>
        </div>
        <div style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1.05rem', marginTop: '2rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Founded in 2012, DriveElite was born from a simple belief: everyone deserves to experience the pinnacle
            of automotive excellence — even if just for a weekend.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            We curate only the finest vehicles from the world's most prestigious manufacturers. From the raw power
            of a Lamborghini Huracán to the serene luxury of a Range Rover Sport, our fleet is a celebration of
            automotive artistry.
          </p>
          <p>
            Every vehicle in our collection is meticulously maintained by certified technicians and subjected to a
            rigorous 100-point inspection before each rental. Because when you drive with DriveElite, you deserve perfection.
          </p>
        </div>
        <div className="features-grid" style={{ marginTop: '3rem' }}>
          {highlights.map(h => (
            <div key={h.title} className="feature-card">
              <div className="feature-icon">{h.icon}</div>
              <div className="feature-title">{h.title}</div>
              <div className="feature-text">{h.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}