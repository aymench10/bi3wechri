import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Eye, Users, FileText, AlertCircle, Search, TrendingUp, Package, DollarSign, ArrowUpDown, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import StatsCard from '../components/StatsCard'
import { fetchAdminStats, updateAdStatus, deleteAd, updateUserRole } from '../lib/dataService'

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
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('stats')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchAdminStats()

      if (result.success) {
        setAds(result.ads || [])
        setUsers(result.users || [])
        setStats(result.stats)
      } else {
        throw new Error('Failed to fetch admin stats')
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdAction = async (adId, action) => {
    try {
      const newStatus = action === 'approve' ? 'active' : 'rejected'
      
      const result = await updateAdStatus(adId, newStatus)

      if (result.success) {
        await fetchData()
      } else {
        throw new Error('Failed to update ad')
      }
    } catch (err) {
      console.error('Error updating ad:', err)
      alert(`Failed to update ad: ${err.message}`)
    }
  }

  const handleDeleteAd = async (adId) => {
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const result = await deleteAd(adId)

      if (result.success) {
        await fetchData()
      } else {
        throw new Error('Failed to delete ad')
      }
    } catch (err) {
      console.error('Error deleting ad:', err)
      alert(`Failed to delete ad: ${err.message}`)
    }
  }

  const handleToggleUserRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      
      const result = await updateUserRole(userId, newRole)

      if (result.success) {
        await fetchData()
      } else {
        throw new Error('Failed to update user role')
      }
    } catch (err) {
      console.error('Error updating user role:', err)
      alert(`Failed to update user role: ${err.message}`)
    }
  }

  const getFilteredAndSortedAds = () => {
    let filtered = ads

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter(ad => ad.status === 'pending')
    } else if (activeTab === 'active') {
      filtered = filtered.filter(ad => ad.status === 'active')
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(ad => ad.status === 'rejected')
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'price':
          aVal = a.price
          bVal = b.price
          break
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        default:
          aVal = new Date(a.created_at)
          bVal = new Date(b.created_at)
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const filteredAds = getFilteredAndSortedAds()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatsCard 
            title="Total Ads"
            value={stats.totalAds}
            icon={Package}
            color="primary"
          />
          <StatsCard 
            title="Pending"
            value={stats.pendingAds}
            icon={AlertCircle}
            color="yellow"
          />
          <StatsCard 
            title="Active"
            value={stats.activeAds}
            icon={Check}
            color="green"
          />
          <StatsCard 
            title="Rejected"
            value={stats.rejectedAds}
            icon={X}
            color="red"
          />
          <StatsCard 
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
          />
          <StatsCard 
            title="Today's Ads"
            value={stats.todayAds}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'stats', label: 'Overview' },
              { id: 'pending', label: `Pending (${stats.pendingAds})` },
              { id: 'active', label: 'Active' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'all', label: 'All Ads' },
              { id: 'users', label: 'Users' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-medium transition-colors whitespace-nowrap relative ${
                  activeTab === tab.id
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Ads by Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active</span>
                      <span className="font-semibold text-green-600">{stats.activeAds}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold text-yellow-600">{stats.pendingAds}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-semibold text-red-600">{stats.rejectedAds}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Today's Ads</span>
                      <span className="font-semibold text-primary-600">{stats.todayAds}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Users</span>
                      <span className="font-semibold text-primary-600">{stats.totalUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ads Tabs */}
        {activeTab !== 'stats' && activeTab !== 'users' && (
          <div>
            {/* Search and Sort */}
            <div className="card p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search ads by title, description, or seller..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSort('created_at')}
                    className={`btn-secondary flex items-center space-x-1 ${sortBy === 'created_at' ? 'bg-primary-100' : ''}`}
                  >
                    <span>Date</span>
                    <ArrowUpDown size={16} />
                  </button>
                  <button
                    onClick={() => toggleSort('price')}
                    className={`btn-secondary flex items-center space-x-1 ${sortBy === 'price' ? 'bg-primary-100' : ''}`}
                  >
                    <span>Price</span>
                    <ArrowUpDown size={16} />
                  </button>
                  <button
                    onClick={() => toggleSort('title')}
                    className={`btn-secondary flex items-center space-x-1 ${sortBy === 'title' ? 'bg-primary-100' : ''}`}
                  >
                    <span>Title</span>
                    <ArrowUpDown size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredAds.length} of {ads.length} ads
              </div>
            </div>

            {/* Ads Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAds.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No ads found
                        </td>
                      </tr>
                    ) : (
                      filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {ad.images && ad.images[0] && (
                                <img
                                  src={ad.images[0]}
                                  alt={ad.title}
                                  className="w-12 h-12 rounded object-cover mr-3"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'
                                  }}
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{ad.title}</div>
                                <div className="text-sm text-gray-500">{ad.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{ad.profiles?.full_name}</div>
                            <div className="text-sm text-gray-500">{ad.profiles?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{ad.price} TND</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              ad.status === 'active' ? 'bg-green-100 text-green-800' :
                              ad.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {ad.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/ads/${ad.id}`}
                                className="text-primary-600 hover:text-primary-900"
                                title="View"
                              >
                                <Eye size={18} />
                              </Link>
                              {ad.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAdAction(ad.id, 'approve')}
                                    className="text-green-600 hover:text-green-900"
                                    title="Approve"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={() => handleAdAction(ad.id, 'reject')}
                                    className="text-red-600 hover:text-red-900"
                                    title="Reject"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteAd(ad.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleUserRole(user.id, user.role)}
                          className={`${
                            user.role === 'admin' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
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
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
