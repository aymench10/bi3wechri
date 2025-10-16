import { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SearchAutocomplete = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions()
    } else {
      setSuggestions([])
    }
  }, [query])

  const fetchSuggestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ads')
        .select('title')
        .eq('status', 'active')
        .ilike('title', `%${query}%`)
        .limit(5)

      if (error) throw error

      // Extract unique titles
      const uniqueTitles = [...new Set(data.map(ad => ad.title))]
      setSuggestions(uniqueTitles)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Trigger search
    onSearch(searchQuery)
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch(query)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearRecentSearch = (searchToRemove) => {
    const updated = recentSearches.filter(s => s !== searchToRemove)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for ads..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white bg-white text-gray-900 placeholder-gray-500 shadow-lg text-base font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          )}

          {/* Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                >
                  <Search size={16} className="text-gray-400" />
                  <span className="text-gray-900">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!loading && query.length < 2 && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-500 uppercase flex items-center space-x-2">
                  <Clock size={14} />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between group"
                >
                  <button
                    onClick={() => handleSuggestionClick(search)}
                    className="flex-grow text-left flex items-center space-x-3"
                  >
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-900">{search}</span>
                  </button>
                  <button
                    onClick={() => clearRecentSearch(search)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query.length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete
