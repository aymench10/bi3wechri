import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { MapPin, Calendar, User, Phone, MessageCircle, Edit, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import ImageGallery from '../components/ImageGallery'
import FavoriteButton from '../components/FavoriteButton'
import SimilarAds from '../components/SimilarAds'
import ChatWindow from '../components/ChatWindow'

const AdDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ad, setAd] = useState(null)
  const [seller, setSeller] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetchAd()
  }, [id])

  const fetchAd = async () => {
    try {
      const { data: adData, error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .single()

      if (adError) throw adError
      setAd(adData)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adData.user_id)
        .single()

      if (profileError) throw profileError
      setSeller(profileData)
    } catch (error) {
      console.error('Error fetching ad:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/my-ads')
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Failed to delete ad')
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ad not found</h2>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const isOwner = user && user.id === ad.user_id

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card p-4">
              <ImageGallery images={ad.images} />
            </div>

            {/* Ad Details */}
            <div className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-grow">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={18} className="mr-1" />
                      <span>{ad.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-1" />
                      <span>{formatDistanceToNow(new Date(ad.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FavoriteButton adId={ad.id} />
                  {isOwner && (
                  <div className="flex space-x-2">
                    <Link to={`/edit-ad/${ad.id}`} className="btn-secondary flex items-center space-x-1">
                      <Edit size={18} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn-danger flex items-center space-x-1"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {ad.category}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold text-primary-600">
                  {ad.price.toLocaleString()} TND
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{ad.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h3>
              
              {seller && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <Link 
                        to={`/profile/${seller.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {seller.full_name}
                      </Link>
                      <p className="text-sm text-gray-500">Member since {new Date(seller.created_at).getFullYear()}</p>
                    </div>
                  </div>

                  {!isOwner && (
                    <div className="space-y-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          if (!user) {
                            navigate('/login', { state: { from: `/ads/${id}` } })
                            return
                          }
                          setShowChat(true)
                        }}
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                      >
                        <MessageCircle size={18} />
                        <span>Chat with Seller</span>
                      </button>
                      <a
                        href={`https://wa.me/${seller.phone.replace(/\D/g, '')}?text=Hi, I'm interested in your ad: ${ad.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full flex items-center justify-center space-x-2 border-2 border-green-600 text-green-600 hover:bg-green-50"
                      >
                        <MessageCircle size={18} />
                        <span>WhatsApp</span>
                      </a>
                      <div className="text-center text-sm text-gray-600 pt-2">
                        <p className="flex items-center justify-center space-x-1">
                          <Phone size={14} />
                          <span>{seller.phone}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Ads Section */}
        <SimilarAds 
          currentAdId={ad.id} 
          category={ad.category} 
          location={ad.location} 
        />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Ad</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this ad? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                className="btn-danger flex-grow"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-grow"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {showChat && seller && (
        <ChatWindow
          adId={ad.id}
          otherUserId={seller.id}
          otherUserName={seller.full_name}
          adTitle={ad.title}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}

export default AdDetail
