import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { tripService } from '../services'

const PlanTrip = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    destinations: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    travelStyle: 'balanced',
    interests: [],
    groupSize: 1
  })

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

  const travelStyles = [
    { id: 'budget', name: 'Budget Explorer', description: 'Maximize experiences, minimize costs' },
    { id: 'balanced', name: 'Balanced Traveler', description: 'Mix of comfort and adventure' },
    { id: 'luxury', name: 'Luxury Seeker', description: 'Premium experiences and accommodations' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const tripData = {
        ...formData,
        destinations: formData.destinations.split(',').map(d => d.trim()),
        budget: parseFloat(formData.budget),
        groupSize: parseInt(formData.groupSize)
      }
      
      const newTrip = await tripService.create(tripData)
      toast.success('Trip created successfully! AI is generating your itinerary...')
      navigate(`/trip/${newTrip.id}`)
    } catch (error) {
      toast.error('Failed to create trip. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Plan Your Perfect Trip</h1>
        <p className="text-surface-600">Let AI create a personalized itinerary just for you</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? 'bg-primary text-white' : 'bg-surface-200 text-surface-600'
              }`}>
                {i}
              </div>
              {i < 3 && (
                <div className={`w-24 h-1 mx-2 rounded-full ${
                  i < step ? 'bg-primary' : 'bg-surface-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-surface-600">
          <span>Basic Details</span>
          <span>Preferences</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="My Amazing Adventure"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Group Size
                </label>
                <select
                  name="groupSize"
                  value={formData.groupSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                    <option key={size} value={size}>{size} {size === 1 ? 'traveler' : 'travelers'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Destinations
              </label>
              <input
                type="text"
                name="destinations"
                value={formData.destinations}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Paris, Rome, Barcelona (separate with commas)"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="5000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Travel Preferences */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Travel Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {travelStyles.map(style => (
                  <motion.div
                    key={style.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.travelStyle === style.id
                        ? 'border-primary bg-primary/5'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.id }))}
                  >
                    <h4 className="font-medium text-surface-900 mb-1">{style.name}</h4>
                    <p className="text-sm text-surface-600">{style.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map(interest => (
                  <motion.div
                    key={interest.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                      formData.interests.includes(interest.id)
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    <ApperIcon name={interest.icon} className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{interest.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-surface-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Trip Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-surface-700">Trip Name:</span>
                  <span className="ml-2 text-surface-900">{formData.name}</span>
                </div>
                <div>
                  <span className="font-medium text-surface-700">Group Size:</span>
                  <span className="ml-2 text-surface-900">{formData.groupSize} travelers</span>
                </div>
                <div>
                  <span className="font-medium text-surface-700">Destinations:</span>
                  <span className="ml-2 text-surface-900">{formData.destinations}</span>
                </div>
                <div>
                  <span className="font-medium text-surface-700">Duration:</span>
                  <span className="ml-2 text-surface-900">{formData.startDate} - {formData.endDate}</span>
                </div>
                <div>
                  <span className="font-medium text-surface-700">Budget:</span>
                  <span className="ml-2 text-surface-900">{formData.currency} {formData.budget}</span>
                </div>
                <div>
                  <span className="font-medium text-surface-700">Travel Style:</span>
                  <span className="ml-2 text-surface-900 capitalize">{formData.travelStyle}</span>
                </div>
              </div>
              {formData.interests.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-surface-700">Interests:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map(interestId => {
                      const interest = interests.find(i => i.id === interestId)
                      return (
                        <span key={interestId} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {interest?.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Sparkles" className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">AI-Powered Itinerary</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Our AI will create a personalized day-by-day itinerary with optimized routes, 
                    activity recommendations, and budget tracking.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-surface-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Creating Trip...' : 'Create Trip'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default PlanTrip