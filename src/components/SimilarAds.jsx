import { useState, useEffect } from 'react'
import { fetchSimilarAds } from '../lib/dataService'
import AdCard from './AdCard'

const SimilarAds = ({ currentAdId, category, location, limit = 4 }) => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSimilarAds()
  }, [currentAdId, category, location])

  const loadSimilarAds = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSimilarAds(currentAdId, category, location, limit)

      if (result.success) {
        setAds(result.data || [])
      } else {
        throw new Error('Failed to fetch similar ads')
      }
    } catch (err) {
      console.error('Error fetching similar ads:', err)
      setError(err.message)
      setAds([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ads.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Ads</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}

export default SimilarAds
