import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AdCard from '../components/AdCard'
import { Plus } from 'lucide-react'

const MyAds = () => {
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, pending, rejected

  useEffect(() => {
    fetchMyAds()
  }, [user, filter])

  const fetchMyAds = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setAds(data || [])
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200'
    }
    return (
      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="section-heading">My Ads</h1>
            <p className="text-gray-600 font-medium">Manage and track all your listings</p>
          </div>
          <Link to="/create-ad" className="btn-primary flex items-center space-x-2 whitespace-nowrap">
            <Plus size={20} />
            <span>Create New Ad</span>
          </Link>
        </div>

        {/* Filter Tabs - Modern Style */}
        <div className="card mb-8 p-1.5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'pending', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-2.5 px-4 rounded-lg font-bold transition-all duration-300 text-sm sm:text-base ${
                  filter === status
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="card p-12 text-center bg-gradient-to-br from-white to-gray-50">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-600 text-lg font-medium mb-4">No ads found</p>
            <p className="text-gray-500 mb-6">Start by creating your first ad to get started</p>
            <Link to="/create-ad" className="btn-primary inline-flex items-center space-x-2">
              <Plus size={20} />
              <span>Create Your First Ad</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map(ad => (
              <div key={ad.id} className="relative">
                <AdCard ad={ad} />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(ad.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAds
