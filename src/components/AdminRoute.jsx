import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Lock } from 'lucide-react'

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-500"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-700 font-bold text-lg">Verifying access...</p>
            <p className="text-gray-500 font-medium text-sm mt-1">Please wait</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4 border border-red-200">
            <Lock size={32} className="text-red-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 font-medium mb-6">You don't have permission to access this page.</p>
          <a href="/" className="btn-primary inline-block">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute
