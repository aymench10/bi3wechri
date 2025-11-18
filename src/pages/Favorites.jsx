import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AdCard from '../components/AdCard'
import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const Favorites = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      
      // Get user's favorites with ad details
      const { data: favoritesData, error: favError } = await supabase
        .from('favorites')
        .select('ad_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (favError) throw favError

      if (favoritesData && favoritesData.length > 0) {
        // Get ad details for all favorited ads
        const adIds = favoritesData.map(fav => fav.ad_id)
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('*')
          .in('id', adIds)

        if (adsError) throw adsError
        setFavorites(adsData || [])
      } else {
        setFavorites([])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (adId) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('ad_id', adId)

      if (error) throw error
      
      // Remove from local state
      setFavorites(favorites.filter(ad => ad.id !== adId))
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Failed to remove favorite')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-2xl mb-4 border border-red-200">
            <Heart size={40} className="text-red-600" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 font-medium mb-6">Please login to view your favorite ads</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-heading">My Favorites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl border border-red-200">
              <Heart size={24} className="text-red-600" fill="currentColor" />
            </div>
            <div>
              <h1 className="section-heading mb-0">My Favorites</h1>
              <p className="text-gray-600 font-medium text-sm">Saved listings</p>
            </div>
          </div>
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-bold border border-primary-200">
            {favorites.length} {favorites.length === 1 ? 'ad' : 'ads'}
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="card p-16 text-center bg-gradient-to-br from-white to-gray-50">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 font-medium mb-6">
              Start adding ads to your favorites by clicking the heart icon
            </p>
            <Link to="/" className="btn-primary">
              Browse Ads
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((ad) => (
              <div key={ad.id} className="relative group">
                <AdCard ad={ad} />
                {/* Remove Button Overlay */}
                <button
                  onClick={() => removeFavorite(ad.id)}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-lg"
                  title="Remove from favorites"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
