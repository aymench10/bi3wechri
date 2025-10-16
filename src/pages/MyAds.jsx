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
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Ads</h1>
          <Link to="/create-ad" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Ad</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-6">
          <div className="flex space-x-1 p-2">
            {['all', 'active', 'pending', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : ads.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No ads found</p>
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
