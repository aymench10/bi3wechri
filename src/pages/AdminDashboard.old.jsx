import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { Check, X, Eye, Users, FileText, AlertCircle, Search, TrendingUp, Package, DollarSign, ArrowUpDown } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import StatsCard from '../components/StatsCard'

const AdminDashboard = () => {
  const [ads, setAds] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalAds: 0,
    pendingAds: 0,
    activeAds: 0,
    rejectedAds: 0,
    totalUsers: 0,
    todayAds: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // pending, all, users, stats
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at') // created_at, price, title
  const [sortOrder, setSortOrder] = useState('desc') // asc, desc

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch all ads
      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })

      if (adsError) throw adsError

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      setAds(adsData || [])
      setUsers(usersData || [])

      // Calculate stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      setStats({
        totalAds: adsData.length,
        pendingAds: adsData.filter(ad => ad.status === 'pending').length,
        activeAds: adsData.filter(ad => ad.status === 'active').length,
        rejectedAds: adsData.filter(ad => ad.status === 'rejected').length,
        totalUsers: usersData.length,
        todayAds: adsData.filter(ad => new Date(ad.created_at) >= today).length
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdAction = async (adId, action) => {
    try {
      const newStatus = action === 'approve' ? 'active' : 'rejected'
      
      const { error } = await supabase
        .from('ads')
        .update({ status: newStatus })
        .eq('id', adId)

      if (error) throw error

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error updating ad:', error)
      alert('Failed to update ad')
    }
  }

  const handleDeleteAd = async (adId) => {
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', adId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Failed to delete ad')
    }
  }

  const handleToggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const filteredAds = activeTab === 'pending' 
    ? ads.filter(ad => ad.status === 'pending')
    : ads

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Ads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAds}</p>
              </div>
              <FileText className="text-primary-600" size={40} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Ads</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingAds}</p>
              </div>
              <AlertCircle className="text-yellow-600" size={40} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Ads</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeAds}</p>
              </div>
              <Check className="text-green-600" size={40} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="text-primary-600" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-6">
          <div className="flex space-x-1 p-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending Ads ({stats.pendingAds})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Ads
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/profile/${user.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                          {user.full_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleToggleUserRole(user.id, user.role)}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAds.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-500 text-lg">No ads found</p>
              </div>
            ) : (
              filteredAds.map(ad => (
                <div key={ad.id} className="card p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0]}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{ad.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            by {ad.profiles?.full_name} • {formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded ${
                          ad.status === 'active' ? 'bg-green-100 text-green-800' :
                          ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ad.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{ad.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span className="font-semibold text-primary-600 text-lg">
                          {ad.price.toLocaleString()} TND
                        </span>
                        <span>•</span>
                        <span>{ad.category}</span>
                        <span>•</span>
                        <span>{ad.location}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/ads/${ad.id}`} className="btn-secondary flex items-center space-x-1 text-sm">
                          <Eye size={16} />
                          <span>View</span>
                        </Link>
                        {ad.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAdAction(ad.id, 'approve')}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                            >
                              <Check size={16} />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleAdAction(ad.id, 'reject')}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm"
                            >
                              <X size={16} />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="btn-danger flex items-center space-x-1 text-sm"
                        >
                          <X size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
