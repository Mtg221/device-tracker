import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminPage({ navigate }) {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      navigate('home')
      return
    }
    
    // Redirect to appropriate admin page based on role
    if (currentUser.role === 'superadmin') {
      navigate('superadmin')
    } else if (currentUser.role === 'admin') {
      navigate('fleetadmin')
    } else {
      navigate('home')
    }
  }, [currentUser, navigate])

  return (
    <div className="page active">
      <div className="loading">
        <div className="spinner" />
        Loading admin dashboard...
      </div>
    </div>
  )
}
