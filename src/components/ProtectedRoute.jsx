import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute - user:', user?.id, 'loading:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-bold text-lg">Loading...</p>
            <p className="text-gray-500 font-medium text-sm mt-1">Please wait while we verify your session</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
