import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { tripService, itineraryService, activityService } from '../services'

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [viewMode, setViewMode] = useState('timeline') // timeline, map, budget

  useEffect(() => {
    const loadTripData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [tripData, itineraryData] = await Promise.all([
          tripService.getById(id),
          itineraryService.getByTripId(id)
        ])
        setTrip(tripData)
        setItinerary(itineraryData)
      } catch (err) {
        setError(err.message || 'Failed to load trip details')
        toast.error('Failed to load trip details')
      } finally {
        setLoading(false)
      }
    }
    loadTripData()
  }, [id])

  const handleActivityToggle = async (activityId, completed) => {
    try {
      await activityService.update(activityId, { completed })
      setItinerary(prev => ({
        ...prev,
        days: prev.days.map(day => ({
          ...day,
          activities: day.activities.map(activity =>
            activity.id === activityId ? { ...activity, completed } : activity
          )
        }))
      }))
      toast.success(completed ? 'Activity completed!' : 'Activity unmarked')
    } catch (err) {
      toast.error('Failed to update activity')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                  <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-surface-200 rounded w-full"></div>
                    <div className="h-3 bg-surface-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-surface-200 rounded"></div>
              </div>
            </div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Trip not found</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!trip || !itinerary) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="MapPin" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Trip not found</h3>
          <p className="text-surface-600 mb-4">The trip you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const currentDay = itinerary.days[selectedDay]

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <h1 className="text-2xl font-bold text-surface-900 break-words">{trip.name}</h1>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              trip.status === 'active' ? 'bg-green-100 text-green-800' :
              trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
              'bg-surface-100 text-surface-600'
            }`}>
              {trip.status}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-surface-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>{trip.dateRange}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MapPin" size={14} />
              <span className="break-words">{trip.destinations.join(', ')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Users" size={14} />
              <span>{trip.members.length} travelers</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'timeline' ? 'bg-primary text-white' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
            }`}
          >
            <ApperIcon name="Clock" size={16} className="mr-1" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'map' ? 'bg-primary text-white' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
            }`}
          >
            <ApperIcon name="Map" size={16} className="mr-1" />
            Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Day Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4">
            <h3 className="font-semibold text-surface-900 mb-4">Days</h3>
            <div className="space-y-2">
              {itinerary.days.map((day, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedDay(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDay === index
                      ? 'bg-primary text-white'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  <div className="font-medium">Day {index + 1}</div>
                  <div className="text-sm opacity-75">{day.date}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {day.activities.length} activities
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {viewMode === 'timeline' && currentDay && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
                <h2 className="text-xl font-bold text-surface-900 mb-2">
                  Day {selectedDay + 1} - {currentDay.date}
                </h2>
                <p className="text-surface-600 mb-4">{currentDay.description}</p>
                <div className="flex items-center space-x-4 text-sm text-surface-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{currentDay.activities.length} activities</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="DollarSign" size={14} />
                    <span>{trip.currency} {currentDay.estimatedCost}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {currentDay.activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'flight' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'hotel' ? 'bg-green-100 text-green-600' :
                            activity.type === 'attraction' ? 'bg-purple-100 text-purple-600' :
                            activity.type === 'dining' ? 'bg-orange-100 text-orange-600' :
                            'bg-surface-100 text-surface-600'
                          }`}>
                            <ApperIcon name={
                              activity.type === 'flight' ? 'Plane' :
                              activity.type === 'hotel' ? 'Bed' :
                              activity.type === 'attraction' ? 'Camera' :
                              activity.type === 'dining' ? 'UtensilsCrossed' :
                              'MapPin'
                            } size={16} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-surface-900 break-words">{activity.name}</h4>
                            <p className="text-sm text-surface-600">{activity.startTime} - {activity.duration} min</p>
                          </div>
                        </div>
                        <div className="ml-11 space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-surface-600">
                            <ApperIcon name="MapPin" size={14} />
                            <span className="break-words">{activity.location.address}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-surface-600">
                            <ApperIcon name="DollarSign" size={14} />
                            <span>{trip.currency} {activity.cost}</span>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-surface-600 break-words">{activity.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleActivityToggle(activity.id, !activity.completed)}
                          className={`p-2 rounded-lg transition-colors ${
                            activity.completed
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                          }`}
                        >
                          <ApperIcon name={activity.completed ? "CheckCircle" : "Circle"} size={16} />
                        </button>
                        <button className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors">
                          <ApperIcon name="MoreHorizontal" size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'map' && (
            <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-surface-900">Trip Map</h2>
                <div className="text-sm text-surface-600">
                  Day {selectedDay + 1} locations
                </div>
              </div>
              <div className="bg-surface-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="Map" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 mb-2">Interactive Map</h3>
                  <p className="text-surface-600">
                    Map integration would show all locations for {currentDay?.date} with optimized routing
                  </p>
                  <div className="mt-4 text-sm text-surface-500">
                    Would integrate with Google Maps or Mapbox for real implementation
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripDetails