import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { tripService, itineraryService } from '../services'

const MainFeature = () => {
  const [activeTrip, setActiveTrip] = useState(null)
  const [todayActivities, setTodayActivities] = useState([])
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickStats, setQuickStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    nextTrip: null
  })

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const trips = await tripService.getAll()
        
        // Find active trip (current or most recent)
        const active = trips.find(trip => trip.status === 'active') || trips[0]
        setActiveTrip(active)
        
        // Get upcoming trips
        const upcoming = trips.filter(trip => trip.status === 'upcoming').slice(0, 3)
        setUpcomingTrips(upcoming)
        
        // Get today's activities if there's an active trip
        if (active) {
          const itinerary = await itineraryService.getByTripId(active.id)
          const today = new Date().toISOString().split('T')[0]
          const todayItinerary = itinerary.days.find(day => day.date === today)
          setTodayActivities(todayItinerary?.activities || [])
        }
        
        // Calculate quick stats
        const totalSpent = trips.reduce((sum, trip) => sum + (trip.spent || 0), 0)
        const nextTrip = trips.find(trip => trip.status === 'upcoming')
        
        setQuickStats({
          totalTrips: trips.length,
          totalSpent,
          nextTrip
        })
      } catch (err) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [])

  const handleCompleteActivity = async (activityId) => {
    try {
      // Update activity status
      const updatedActivities = todayActivities.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
      setTodayActivities(updatedActivities)
      toast.success('Activity updated!')
    } catch (err) {
      toast.error('Failed to update activity')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-primary text-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Trips</p>
              <p className="text-2xl font-bold">{quickStats.totalTrips}</p>
            </div>
            <ApperIcon name="MapPin" className="w-8 h-8 text-blue-100" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Spent</p>
              <p className="text-2xl font-bold">${quickStats.totalSpent.toLocaleString()}</p>
            </div>
            <ApperIcon name="DollarSign" className="w-8 h-8 text-green-100" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-secondary text-white rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Next Trip</p>
              <p className="text-lg font-bold break-words">
                {quickStats.nextTrip ? quickStats.nextTrip.name : 'None planned'}
              </p>
            </div>
            <ApperIcon name="Calendar" className="w-8 h-8 text-purple-100" />
          </div>
        </motion.div>
      </div>

      {/* Today's Schedule */}
      {activeTrip && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-surface-900">Today's Schedule</h3>
              <p className="text-sm text-surface-600 break-words">
                {activeTrip.name} • {new Date().toLocaleDateString()}
              </p>
            </div>
            <Link
              to={`/trip/${activeTrip.id}`}
              className="text-primary hover:text-blue-600 text-sm font-medium"
            >
              View Full Trip
            </Link>
          </div>
          
          {todayActivities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
              <p className="text-surface-600">No activities scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayActivities.slice(0, 4).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    activity.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-surface-200 bg-white hover:border-surface-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                      } size={18} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        activity.completed ? 'text-green-800 line-through' : 'text-surface-900'
                      } break-words`}>
                        {activity.name}
                      </h4>
                      <p className="text-sm text-surface-600">
                        {activity.startTime} • {activity.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-surface-900">
                      ${activity.cost}
                    </span>
                    <button
                      onClick={() => handleCompleteActivity(activity.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        activity.completed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      <ApperIcon name={activity.completed ? "CheckCircle" : "Circle"} size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {todayActivities.length > 4 && (
                <div className="text-center pt-2">
                  <Link
                    to={`/trip/${activeTrip.id}`}
                    className="text-primary hover:text-blue-600 text-sm font-medium"
                  >
                    View {todayActivities.length - 4} more activities
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Upcoming Trips</h3>
          <div className="space-y-3">
            {upcomingTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-surface-900 break-words">{trip.name}</h4>
                    <p className="text-sm text-surface-600">{trip.dateRange}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-900">
                      {trip.destinations.join(', ')}
                    </p>
                    <p className="text-xs text-surface-600">
                      {trip.currency} {trip.budget.toLocaleString()}
                    </p>
                  </div>
                  <Link
                    to={`/trip/${trip.id}`}
                    className="p-2 text-primary hover:text-blue-600 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <ApperIcon name="ArrowRight" size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/plan-trip"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Plus" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <span className="text-sm font-medium text-surface-900 group-hover:text-primary">
              Plan Trip
            </span>
          </Link>
          <Link
            to="/search"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Search" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <span className="text-sm font-medium text-surface-900 group-hover:text-primary">
              Search
            </span>
          </Link>
          <Link
            to="/budget"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="DollarSign" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <span className="text-sm font-medium text-surface-900 group-hover:text-primary">
              Budget
            </span>
          </Link>
          <Link
            to="/collaborate"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Users" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <span className="text-sm font-medium text-surface-900 group-hover:text-primary">
              Collaborate
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainFeature