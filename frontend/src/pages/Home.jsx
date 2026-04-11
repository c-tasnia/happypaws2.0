import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif" }}>
      {/* Navbar */}
      <div className="navbar bg-white shadow-sm px-8 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/donations">Donations</Link></li>
              <li><a>Blog</a></li>
              <li><a>Volunteer</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: '#1a6b5c' }}>
            🐾 Happy Paws
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1 text-sm font-medium">
            <li><Link to="/" className="hover:text-teal-700">Home</Link></li>
            <li><Link to="/donations" className="hover:text-teal-700">Donations</Link></li>
            <li><a className="hover:text-teal-700">Blog</a></li>
            <li><a className="hover:text-teal-700">Volunteer</a></li>
            <li><a className="hover:text-teal-700">Contact</a></li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          {user ? (
            <>
              <span className="text-sm hidden lg:block text-gray-500">{user.email}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-sm text-white" style={{ background: '#1a6b5c' }}>Register</Link>
            </>
          )}
          <Link to="/payment" className="btn btn-sm text-white hidden lg:flex" style={{ background: '#1a6b5c' }}>
            DONATE NOW
          </Link>
        </div>
      </div>

      <Outlet />

      {/* Hero only on index */}
    </div>
  )
}
