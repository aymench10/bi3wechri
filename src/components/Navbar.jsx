import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, Plus, User, LogOut, LayoutDashboard, List, Heart } from 'lucide-react'
import { useState } from 'react'
import NotificationBell from './NotificationBell'
import MessageNotification from './MessageNotification'
import SearchAutocomplete from './SearchAutocomplete'

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`)
    setMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-2 rounded-lg font-bold text-xl shadow-md hover:shadow-lg transition-shadow">
              Bi3wEchri
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-grow max-w-2xl">
            <SearchAutocomplete onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <>
                <Link to="/create-ad" className="btn-primary flex items-center space-x-2">
                  <Plus size={20} />
                  <span>Post Ad</span>
                </Link>
                <Link to="/my-ads" className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <List size={20} />
                  <span>My Ads</span>
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <Heart size={20} />
                  <span>Favorites</span>
                </Link>
                <MessageNotification />
                <NotificationBell />
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                    <LayoutDashboard size={20} />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-primary-600 flex items-center space-x-1">
                  <User size={20} />
                  <span>{profile?.full_name || 'Profile'}</span>
                </Link>
                <button onClick={handleSignOut} className="text-gray-700 hover:text-red-600 flex items-center space-x-1">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>

            {user ? (
              <div className="flex flex-col space-y-3">
                <Link to="/create-ad" className="btn-primary flex items-center justify-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <Plus size={20} />
                  <span>Post Ad</span>
                </Link>
                <Link to="/my-ads" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  My Ads
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Favorites
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleSignOut} className="text-red-600 hover:text-red-700 py-2 text-left">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
