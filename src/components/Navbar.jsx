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
    try {
      // Call signOut function
      await signOut()
      
      // Close mobile menu
      setMobileMenuOpen(false)
      
      // Navigate to home page
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Logout error:', err)
      // Still navigate even if error occurs
      setMobileMenuOpen(false)
      navigate('/', { replace: true })
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 gap-4 lg:gap-8">
          {/* Logo - Professional Modern Marketplace Branding */}
          <Link to="/" className="flex-shrink-0 group flex items-center space-x-3">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shopping bag icon style */}
              <svg className="w-6 h-6 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V3a1 1 0 011-1h8a1 1 0 011 1v1h4a1 1 0 011 1v2h-1.05L15.066 20.573A2 2 0 0113.12 22H10.88a2 2 0 01-1.946-1.427L4.05 8H3a1 1 0 01-1-1V5a1 1 0 011-1h4zm2 0h6V3H9v1z"/>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-gray-900 font-black text-lg leading-tight">Bi3w</span>
                <span className="text-primary-600 font-black text-lg">Echri</span>
              </div>
              <span className="text-gray-500 text-xs font-bold tracking-widest">MARKETPLACE</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-grow max-w-2xl">
            <SearchAutocomplete onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
            {user ? (
              <>
                <Link to="/create-ad" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                  <Plus size={18} />
                  <span className="hidden lg:inline">Post Ad</span>
                </Link>
                <Link to="/my-ads" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 font-medium text-sm">
                  <List size={18} />
                  <span className="hidden lg:inline">My Ads</span>
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 font-medium text-sm">
                  <Heart size={18} />
                  <span className="hidden lg:inline">Favorites</span>
                </Link>
                <MessageNotification onNavigate={() => setMobileMenuOpen(false)} />
                <NotificationBell />
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 font-medium text-sm">
                    <LayoutDashboard size={18} />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 font-medium text-sm">
                  <User size={18} />
                  <span className="hidden xl:inline">{profile?.full_name || 'Profile'}</span>
                </Link>
                <button onClick={handleSignOut} className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 font-medium text-sm">
                  <LogOut size={18} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-4 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm">Login</Link>
                <Link to="/signup" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            {/* Mobile Search */}
            <div className="mb-3">
              <SearchAutocomplete onSearch={handleSearch} />
            </div>

            {user ? (
              <div className="flex flex-col space-y-2">
                <Link to="/create-ad" className="btn-primary flex items-center justify-center space-x-2 rounded-xl py-3 font-bold" onClick={() => setMobileMenuOpen(false)}>
                  <Plus size={20} />
                  <span>Post Ad</span>
                </Link>
                <Link to="/my-ads" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  My Ads
                </Link>
                <Link to="/favorites" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Favorites
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <div className="h-px bg-gray-200 my-2"></div>
                <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleSignOut} className="text-red-600 hover:text-red-700 hover:bg-red-50 py-2.5 px-3 rounded-lg font-bold transition-colors text-left w-full">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 py-2.5 px-3 rounded-lg font-bold transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-center rounded-xl py-3 font-bold" onClick={() => setMobileMenuOpen(false)}>
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
