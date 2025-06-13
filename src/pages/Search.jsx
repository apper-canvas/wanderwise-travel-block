import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { searchService } from '../services'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')

  const filters = [
    { id: 'all', name: 'All', icon: 'Search' },
    { id: 'flights', name: 'Flights', icon: 'Plane' },
    { id: 'hotels', name: 'Hotels', icon: 'Bed' },
    { id: 'activities', name: 'Activities', icon: 'Camera' },
    { id: 'restaurants', name: 'Restaurants', icon: 'UtensilsCrossed' }
  ]

  const sortOptions = [
    { id: 'relevance', name: 'Relevance' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Rating' },
    { id: 'distance', name: 'Distance' }
  ]

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        handleSearch()
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
    }
  }, [query, activeFilter, sortBy])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const searchResults = await searchService.search({
        query,
        type: activeFilter,
        sortBy
      })
      setResults(searchResults)
    } catch (err) {
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBookItem = async (item) => {
    try {
      await searchService.book(item.id)
      toast.success(`${item.name} booking initiated!`)
    } catch (err) {
      toast.error('Booking failed. Please try again.')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Search Travel Options</h1>
        <p className="text-surface-600 mb-6">Find flights, hotels, activities and more from multiple providers</p>

        {/* Search Input */}
        <div className="relative mb-6">
          <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            placeholder="Search destinations, hotels, activities..."
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <ApperIcon name="Loader2" className="animate-spin text-primary" size={20} />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name={filter.icon} size={16} />
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading && query.length > 2 && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-surface-200 rounded w-2/3"></div>
                    </div>
                    <div className="ml-6">
                      <div className="h-8 bg-surface-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <ApperIcon name="SearchX" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">No results found</h3>
              <p className="text-surface-600 mb-4">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </motion.div>
          )}

          {!loading && query.length <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <ApperIcon name="Globe" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-surface-900 mb-2">Start your search</h3>
              <p className="text-surface-600 mb-4">
                Enter at least 3 characters to search for flights, hotels, activities and more
              </p>
            </motion.div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-surface-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        item.type === 'flight' ? 'bg-blue-100 text-blue-600' :
                        item.type === 'hotel' ? 'bg-green-100 text-green-600' :
                        item.type === 'activity' ? 'bg-purple-100 text-purple-600' :
                        item.type === 'restaurant' ? 'bg-orange-100 text-orange-600' :
                        'bg-surface-100 text-surface-600'
                      }`}>
                        <ApperIcon name={
                          item.type === 'flight' ? 'Plane' :
                          item.type === 'hotel' ? 'Bed' :
                          item.type === 'activity' ? 'Camera' :
                          item.type === 'restaurant' ? 'UtensilsCrossed' :
                          'MapPin'
                        } size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-surface-900 mb-1 break-words">
                          {item.name}
                        </h3>
                        <p className="text-surface-600 mb-2 break-words">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="MapPin" size={14} />
                            <span className="break-words">{item.location}</span>
                          </div>
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Star" size={14} className="text-yellow-500" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                          {item.provider && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Building" size={14} />
                              <span>{item.provider}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-surface-900 mb-1">
                        ${item.price}
                      </div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-sm text-surface-500 line-through mb-2">
                          ${item.originalPrice}
                        </div>
                      )}
                      <button
                        onClick={() => handleBookItem(item)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105 whitespace-nowrap"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search