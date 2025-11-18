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
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 gap-4 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-bold text-lg sm:text-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              Bi3wEchri
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-grow max-w-2xl">
            <SearchAutocomplete onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {user ? (
              <>
                <Link to="/create-ad" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Plus size={18} />
                  <span className="hidden lg:inline">Post Ad</span>
                </Link>
                <Link to="/my-ads" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5">
                  <List size={18} />
                  <span className="hidden lg:inline font-medium">My Ads</span>
                </Link>
                <Link to="/favorites" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5">
                  <Heart size={18} />
                  <span className="hidden lg:inline font-medium">Favorites</span>
                </Link>
                <MessageNotification />
                <NotificationBell />
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5">
                    <LayoutDashboard size={18} />
                    <span className="hidden lg:inline font-medium">Admin</span>
                  </Link>
                )}
                <Link to={`/profile/${user.id}`} className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5">
                  <User size={18} />
                  <span className="hidden xl:inline font-medium">{profile?.full_name || 'Profile'}</span>
                </Link>
                <button onClick={handleSignOut} className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1.5">
                  <LogOut size={18} />
                  <span className="hidden lg:inline font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium">Login</Link>
                <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all duration-300 hover:scale-105">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            {/* Mobile Search */}
            <div className="mb-3">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>

            {user ? (
              <div className="flex flex-col space-y-2">
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
                <div onClick={() => setMobileMenuOpen(false)}>
                  <MessageNotification />
                </div>
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
