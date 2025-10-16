import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AdCard from '../components/AdCard'
import UserAvatar from '../components/UserAvatar'
import { User, MapPin, Phone, Mail, Calendar, Edit2, Package, Heart } from 'lucide-react'
import { format } from 'date-fns'

const Profile = () => {
  const { userId } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [ads, setAds] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('ads')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: ''
  })
  const [saving, setSaving] = useState(false)
  
  const isOwnProfile = user && user.id === userId

  useEffect(() => {
    fetchProfileAndAds()
    if (isOwnProfile) {
      fetchFavorites()
    }
  }, [userId, isOwnProfile])

  const fetchProfileAndAds = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      const { data: adsData, error: adsError } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (adsError) throw adsError
      setAds(adsData || [])
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('ad_id')
        .eq('user_id', userId)

      if (favError) throw favError

      if (favData && favData.length > 0) {
        const adIds = favData.map(fav => fav.ad_id)
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('*')
          .in('id', adIds)

        if (adsError) throw adsError
        setFavorites(adsData || [])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handleEditClick = () => {
    setEditForm({
      full_name: profile.full_name || '',
      phone: profile.phone || ''
    })
    setShowEditModal(true)
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update(editForm)
        .eq('id', userId)

      if (error) throw error

      setProfile({ ...profile, ...editForm })
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <UserAvatar 
              name={profile.full_name} 
              size="2xl"
            />
            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                {isOwnProfile && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    title="Edit profile"
                  >
                    <Edit2 size={20} />
                  </button>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-gray-600 mb-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Phone size={18} className="mr-2" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail size={18} className="mr-2" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Calendar size={18} className="mr-2" />
                  <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{ads.length}</div>
                  <div className="text-sm text-gray-600">Active Ads</div>
                </div>
                {isOwnProfile && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
                    <div className="text-sm text-gray-600">Favorites</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isOwnProfile && (
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ads')}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === 'ads'
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package size={20} />
                  <span>My Ads</span>
                </div>
                {activeTab === 'ads' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === 'favorites'
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Heart size={20} />
                  <span>Favorites</span>
                </div>
                {activeTab === 'favorites' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {(!isOwnProfile || activeTab === 'ads') && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isOwnProfile ? 'My' : ''} Active Ads ({ads.length})
            </h2>
            
            {ads.length === 0 ? (
              <div className="card p-12 text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No active ads yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        )}

        {isOwnProfile && activeTab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Favorites ({favorites.length})
            </h2>
            
            {favorites.length === 0 ? (
              <div className="card p-12 text-center">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No favorites yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-field"
                  placeholder="+216 XX XXX XXX"
                />
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-primary flex-grow"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="btn-secondary flex-grow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
