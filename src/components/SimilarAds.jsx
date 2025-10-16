import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdCard from './AdCard'

const SimilarAds = ({ currentAdId, category, location, limit = 4 }) => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSimilarAds()
  }, [currentAdId, category, location])

  const fetchSimilarAds = async () => {
    try {
      setLoading(true)
      
      // Fetch ads with same category or location, excluding current ad
      let query = supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .neq('id', currentAdId)
        .limit(limit)

      // Prioritize same category
      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      // If not enough ads with same category, fetch more with same location
      if (data && data.length < limit && location) {
        const { data: locationAds, error: locationError } = await supabase
          .from('ads')
          .select('*')
          .eq('status', 'active')
          .eq('location', location)
          .neq('id', currentAdId)
          .limit(limit - data.length)
          .order('created_at', { ascending: false })

        if (!locationError && locationAds) {
          // Combine and remove duplicates
          const combined = [...data, ...locationAds]
          const unique = combined.filter((ad, index, self) =>
            index === self.findIndex((a) => a.id === ad.id)
          )
          setAds(unique.slice(0, limit))
        } else {
          setAds(data)
        }
      } else {
        setAds(data || [])
      }
    } catch (error) {
      console.error('Error fetching similar ads:', error)
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
