import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import FleetPage from './pages/FleetPage'
import AboutPage from './pages/AboutPage'
import BookingsPage from './pages/BookingsPage'
import AdminPage from './pages/AdminPage'
import FleetAdminPage from './pages/FleetAdminPage'
import SuperAdminPage from './pages/SuperAdminPage'
import RegionsPage from './pages/RegionsPage'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'

export default function App() {
const [page, setPage] = useState('home')
const [toast, setToast] = useState(null)
const [modal, setModal] = useState(null)

const showToast = (msg, type = '') => setToast({ msg, type })
const openModal = (name) => setModal(name)
const closeModal = () => setModal(null)

const navigate = (p) => { 
  setPage(p)
  window.scrollTo(0, 0)
}

const shared = { navigate, showToast, openModal }

return (
<AuthProvider>
<Navbar page={page} navigate={navigate} openModal={openModal} />

<main>
{page === 'home' && <HomePage {...shared} />}
{page === 'fleet' && <FleetPage {...shared} />}
{page === 'regions' && <RegionsPage {...shared} />}
{page === 'about' && <AboutPage />}
{page === 'bookings' && <BookingsPage {...shared} />}
{page === 'admin' && <AdminPage {...shared} />}
{page === 'fleetadmin' && <FleetAdminPage {...shared} />}
{page === 'superadmin' && <SuperAdminPage {...shared} />}
</main>

{modal === 'login' && <LoginModal onClose={closeModal} showToast={showToast} openModal={openModal} />}
{modal === 'register' && <RegisterModal onClose={closeModal} showToast={showToast} openModal={openModal} />}

<Toast toast={toast} onDone={() => setToast(null)} />
</AuthProvider>
)
}
