import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdCard from '../components/AdCard'
import FeaturedCategories from '../components/FeaturedCategories'
import CategoryDiscovery from '../components/CategoryDiscovery'
import Pagination from '../components/Pagination'
import { MapPin } from 'lucide-react'

const CATEGORIES = [
  'All',
  'Informatique et Multimedia',
  'Vehicles',
  'Real Estate',
  'Furniture',
  'Fashion',
  'Jobs',
  'Services',
  'Other'
]

const LOCATIONS = [
  'All',
  'Tunis',
  'Sfax',
  'Sousse',
  'Kairouan',
  'Bizerte',
  'Gabès',
  'Ariana',
  'Gafsa',
  'Monastir',
  'Ben Arous'
]

const Home = () => {
  const [searchParams] = useSearchParams()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAds, setTotalAds] = useState(0)
  const adsPerPage = 12

  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    fetchAds()
  }, [selectedCategory, selectedLocation, currentPage, searchQuery])

  const fetchAds = async () => {
    try {
      setLoading(true)
      
      // Get total count first
      let countQuery = supabase
        .from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
      
      if (selectedCategory !== 'All') {
        countQuery = countQuery.eq('category', selectedCategory)
      }
      if (selectedLocation !== 'All') {
        countQuery = countQuery.eq('location', selectedLocation)
      }
      
      const { count } = await countQuery
      setTotalAds(count || 0)
      
      // Fetch paginated ads
      const from = (currentPage - 1) * adsPerPage
      const to = from + adsPerPage - 1
      
      let query = supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(from, to)

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory)
      }

      if (selectedLocation !== 'All') {
        query = query.eq('location', selectedLocation)
      }

      const { data, error } = await query

      if (error) throw error
      setAds(data || [])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }
  
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  
  const totalPages = Math.ceil(totalAds / adsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-primary-600 to-primary-800 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 animate-fade-in">
              Find What You Need
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-2 px-4">
              Buy and sell anything, anywhere in Tunisia
            </p>
            <p className="text-sm sm:text-base md:text-lg text-blue-200">
              🛍️ Bi3wEchri - Your Trusted Marketplace
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">{totalAds}+</div>
              <div className="text-xs sm:text-sm text-blue-200">Active Ads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">10+</div>
              <div className="text-xs sm:text-sm text-blue-200">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">11</div>
              <div className="text-xs sm:text-sm text-blue-200">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Discovery Section */}
      <CategoryDiscovery onCategoryClick={handleCategoryClick} />

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedCategories onCategoryClick={handleCategoryClick} />
        
        {/* City Filter - Clean and Modern */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full shadow-md px-6 py-3 border border-gray-100 hover:shadow-lg transition-shadow">
            <MapPin size={20} className="text-primary-600" />
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-gray-900 cursor-pointer text-base pr-8"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="ads-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ads Grid */}
        <div className="w-full">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading ads...</p>
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No ads found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedLocation('All')
                    window.location.href = '/'
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Header - Same style as Filters */}
                <div className="mb-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-gray-900 font-bold text-lg">
                        Found <span className="text-primary-600">{totalAds}</span> {totalAds === 1 ? 'ad' : 'ads'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                </div>

                {/* Ads Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {ads.map(ad => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
        </div>
      </div>
    </div>
  )
}

export default Home
