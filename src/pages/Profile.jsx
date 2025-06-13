import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { userService } from '../services'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [preferences, setPreferences] = useState({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const travelPreferences = [
    { id: 'budget', name: 'Budget Explorer', description: 'Maximize experiences, minimize costs' },
    { id: 'balanced', name: 'Balanced Traveler', description: 'Mix of comfort and adventure' },
    { id: 'luxury', name: 'Luxury Seeker', description: 'Premium experiences and accommodations' },
    { id: 'adventure', name: 'Adventure Seeker', description: 'Thrills and outdoor activities' },
    { id: 'cultural', name: 'Culture Enthusiast', description: 'Museums, history, and local culture' },
    { id: 'relaxation', name: 'Relaxation Focused', description: 'Wellness and peaceful experiences' }
  ]

  const interests = [
    { id: 'culture', name: 'Culture & History', icon: 'Museum' },
    { id: 'nature', name: 'Nature & Outdoors', icon: 'Trees' },
    { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed' },
    { id: 'nightlife', name: 'Nightlife & Entertainment', icon: 'Music' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag' },
    { id: 'adventure', name: 'Adventure Sports', icon: 'Mountain' },
    { id: 'relaxation', name: 'Relaxation & Wellness', icon: 'Waves' },
    { id: 'photography', name: 'Photography', icon: 'Camera' }
  ]

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const [userData, preferencesData] = await Promise.all([
          userService.getProfile(),
          userService.getPreferences()
        ])
        setUser(userData)
        setPreferences(preferencesData)
        setFormData({ ...userData, ...preferencesData })
      } catch (err) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await userService.updateProfile(formData)
      setUser(prev => ({ ...prev, ...formData }))
      setPreferences(prev => ({ ...prev, ...formData }))
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error('Failed to update profile')
    }
  }

  const handleInterestToggle = (interestId) => {
    const currentInterests = formData.interests || []
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId]
    
    setFormData(prev => ({ ...prev, interests: newInterests }))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded w-full"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded w-full"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Profile & Preferences</h1>
          <p className="text-surface-600">Customize your travel planning experience</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
        >
          <ApperIcon name={editing ? "X" : "Edit"} size={16} />
          <span>{editing ? "Cancel" : "Edit Profile"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
                  {user?.name || 'Not set'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
                  {user?.email || 'Not set'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
                  {user?.phone || 'Not set'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Preferred Currency
              </label>
              {editing ? (
                <select
                  value={formData.preferredCurrency || 'USD'}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredCurrency: e.target.value }))}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
                  {preferences?.preferredCurrency || 'USD'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Travel Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelPreferences.map(style => (
              <motion.div
                key={style.id}
                whileHover={{ scale: editing ? 1.02 : 1 }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  (formData.travelStyle || preferences.travelStyle) === style.id
                    ? 'border-primary bg-primary/5'
                    : 'border-surface-200'
                } ${editing ? 'cursor-pointer hover:border-surface-300' : ''}`}
                onClick={() => editing && setFormData(prev => ({ ...prev, travelStyle: style.id }))}
              >
                <h4 className="font-medium text-surface-900 mb-1">{style.name}</h4>
                <p className="text-sm text-surface-600">{style.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Interests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map(interest => {
              const isSelected = (formData.interests || preferences.interests || []).includes(interest.id)
              return (
                <motion.div
                  key={interest.id}
                  whileHover={{ scale: editing ? 1.05 : 1 }}
                  whileTap={editing ? { scale: 0.95 } : {}}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-200'
                  } ${editing ? 'cursor-pointer hover:border-surface-300' : ''}`}
                  onClick={() => editing && handleInterestToggle(interest.id)}
                >
                  <ApperIcon name={interest.icon} className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{interest.name}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { id: 'email', name: 'Email Notifications', description: 'Trip updates, booking confirmations, and reminders' },
              { id: 'push', name: 'Push Notifications', description: 'Real-time updates about your trips' },
              { id: 'sms', name: 'SMS Notifications', description: 'Critical updates and flight alerts' },
              { id: 'marketing', name: 'Marketing Emails', description: 'Travel deals and destination recommendations' }
            ].map(option => (
              <div key={option.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-surface-900">{option.name}</h5>
                  <p className="text-sm text-surface-600">{option.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => editing && setFormData(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [option.id]: !prev.notifications?.[option.id]
                    }
                  }))}
                  disabled={!editing}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.notifications?.[option.id] || preferences.notifications?.[option.id]
                      ? 'bg-primary'
                      : 'bg-surface-300'
                  } ${editing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.notifications?.[option.id] || preferences.notifications?.[option.id]
                        ? 'translate-x-6'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {editing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setFormData({ ...user, ...preferences })
              }}
              className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default Profile