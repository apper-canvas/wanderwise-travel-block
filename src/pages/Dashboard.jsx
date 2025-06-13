import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { tripService } from '../services'

const Dashboard = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await tripService.getAll()
        setTrips(result)
      } catch (err) {
        setError(err.message || 'Failed to load trips')
        toast.error('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Your Trips</h1>
          <p className="text-surface-600">Plan, track, and enjoy your adventures</p>
        </div>
        <Link
          to="/plan-trip"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Plan New Trip</span>
        </Link>
      </div>

      <MainFeature />

      {trips.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-medium text-surface-900 mb-2">Ready for your next adventure?</h3>
          <p className="text-surface-600 mb-6">Create your first trip and let AI plan the perfect itinerary</p>
          <Link
            to="/plan-trip"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
          >
            <ApperIcon name="Sparkles" size={16} />
            <span>Start Planning</span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 hover:shadow-md transition-all"
            >
              <Link to={`/trip/${trip.id}`} className="block p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-surface-900 break-words">{trip.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'active' ? 'bg-green-100 text-green-800' :
                    trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-surface-100 text-surface-600'
                  }`}>
                    {trip.status}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-surface-600">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" size={14} />
                    <span>{trip.dateRange}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="MapPin" size={14} />
                    <span className="break-words">{trip.destinations.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="DollarSign" size={14} />
                    <span>{trip.currency} {trip.budget.toLocaleString()}</span>
                  </div>
                  {trip.members.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" size={14} />
                      <span>{trip.members.length} travelers</span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard