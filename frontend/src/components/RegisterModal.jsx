import { useState } from 'react'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

export default function RegisterModal({ onClose, showToast, openModal }) {
  const { register } = useAuth()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  const handleRegister = async () => {
    setError('')
    try {
      const user = await register(name, email, password)
      onClose()
      showToast(`Welcome to DriveElite, ${user.name}!`, 'success')
    } catch (e) {
      setError(e.message)
    }
  }

  const footer = (
    <button className="btn-primary" style={{ flex: 1 }} onClick={handleRegister}>
      Create Account
    </button>
  )

  return (
    <Modal title="Create Account" onClose={onClose} footer={footer}>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" placeholder="John Smith" value={name}
          onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="you@email.com" value={email}
          onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Min 6 characters" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRegister()} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <p style={{ textAlign: 'center', paddingTop: '0.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        Already a member?{' '}
        <span style={{ color: 'var(--gold)', cursor: 'pointer' }}
          onClick={() => { onClose(); openModal('login') }}>
          Sign in
        </span>
      </p>
    </Modal>
  )
}