import { useState } from 'react'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'

export default function LoginModal({ onClose, showToast, openModal }) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      const user = await login(email, password)
      onClose()
      showToast(`Welcome back, ${user.name}!`, 'success')
    } catch (e) {
      setError(e.message)
    }
  }

  const footer = (
    <>
      <button className="btn-primary" style={{ flex: 1 }} onClick={handleLogin}>Sign In</button>
    </>
  )

  return (
    <Modal title="Welcome Back" onClose={onClose} footer={footer}>
      <div className="form-group">
        <label>Email</label>
        <input type="email" placeholder="you@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="••••••••" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
      </div>
      {error && <p className="form-error">{error}</p>}
      <p style={{ textAlign: 'center', paddingTop: '0.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        No account?{' '}
        <span style={{ color: 'var(--gold)', cursor: 'pointer' }}
          onClick={() => { onClose(); openModal('register') }}>
          Register here
        </span>
      </p>
    </Modal>
  )
}