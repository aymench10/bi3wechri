import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdCard from '../components/AdCard'
import FeaturedCategories from '../components/FeaturedCategories'
import CategoryDiscovery from '../components/CategoryDiscovery'
import PromoBanner from '../components/PromoBanner'
import Pagination from '../components/Pagination'
import ImageSlider from '../components/ImageSlider'
import { MapPin } from 'lucide-react'

const CATEGORIES = [
  'All',
  'Informatique et Multimedia',
  'Vehicles',
  'Immobilier',
  'Furniture',
  'Fashion',
  'Jobs',
  'Services',
  'Other'
]

const LOCATIONS = [
  'All',
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Medenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili'
]

const Home = () => {
  const [searchParams] = useSearchParams()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalAds, setTotalAds] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [previousSearchQuery, setPreviousSearchQuery] = useState('')
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
      
      // Detect if search query changed
      const searchQueryChanged = searchQuery !== previousSearchQuery
      
      // Scroll to ads section if not initial load OR if search query changed
      if (!isInitialLoad || searchQueryChanged) {
        setTimeout(() => {
          const adsSection = document.getElementById('ads-section')
          if (adsSection) {
            adsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
      
      // Update states
      if (isInitialLoad) {
        setIsInitialLoad(false)
      }
      if (searchQueryChanged) {
        setPreviousSearchQuery(searchQuery)
      }
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
      {/* Hero Section - Professional Modern Design */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-12 sm:py-14 md:py-16 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs - Subtle and Professional */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content - Compact Layout */}
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/8 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-4 animate-fade-in hover:bg-white/12 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">Tunisia's #1 Marketplace</span>
            </div>
            
            {/* Main Heading - Enhanced Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 leading-tight tracking-tight">
              <span className="block animate-fade-in">Find What You</span>
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent animate-fade-in-delay font-black">
                Need Today
              </span>
            </h1>
            
            {/* Subtitle - Professional Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-1 px-4 max-w-3xl mx-auto font-medium animate-slide-up">
              Discover thousands of listings across Tunisia's most trusted marketplace
            </p>
            
            {/* Trust Indicator */}
            <div className="flex items-center justify-center space-x-2 text-slate-300 text-sm animate-slide-up mb-6">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">Trusted by thousands of Tunisians</span>
            </div>
          </div>
          
          {/* Stats Cards - Premium Glass Morphism */}
          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            <div className="group relative bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-5 sm:p-6 hover:bg-white/12 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {totalAds}+
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Active Listings</div>
              </div>
            </div>
            
            <div className="group relative bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-5 sm:p-6 hover:bg-white/12 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  10+
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Categories</div>
              </div>
            </div>
            
            <div className="group relative bg-white/8 backdrop-blur-xl border border-white/12 rounded-2xl p-5 sm:p-6 hover:bg-white/12 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  11
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slider */}
      <ImageSlider />

      {/* Category Discovery Section */}
      <CategoryDiscovery onCategoryClick={handleCategoryClick} />

      {/* Promotional Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PromoBanner />
      </div>

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
