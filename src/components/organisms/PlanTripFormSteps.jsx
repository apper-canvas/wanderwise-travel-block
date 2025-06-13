import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const travelStyles = [
  { id: 'budget', name: 'Budget Explorer', description: 'Maximize experiences, minimize costs' },
  { id: 'balanced', name: 'Balanced Traveler', description: 'Mix of comfort and adventure' },
  { id: 'luxury', name: 'Luxury Seeker', description: 'Premium experiences and accommodations' }
];

const interestsData = [
  { id: 'culture', name: 'Culture & History', icon: 'Museum' },
  { id: 'nature', name: 'Nature & Outdoors', icon: 'Trees' },
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed' },
  { id: 'nightlife', name: 'Nightlife & Entertainment', icon: 'Music' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag' },
  { id: 'adventure', name: 'Adventure Sports', icon: 'Mountain' },
  { id: 'relaxation', name: 'Relaxation & Wellness', icon: 'Waves' },
  { id: 'photography', name: 'Photography', icon: 'Camera' }
];

const PlanTripFormSteps = ({ step, formData, handleInputChange, handleInterestToggle, setFormData, loading, onSubmit, prevStep, nextStep }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Step 1: Basic Details */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Trip Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="My Amazing Adventure"
              required
            />
            <FormField label="Group Size">
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
            </FormField>
          </div>

          <FormField
            label="Destinations"
            name="destinations"
            value={formData.destinations}
            onChange={handleInputChange}
            placeholder="Paris, Rome, Barcelona (separate with commas)"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Budget"
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="5000"
              required
            />
            <FormField label="Currency">
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
            </FormField>
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
            <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Travel Style</Heading>
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
                  <Heading level={4} className="!font-medium !text-surface-900 mb-1">{style.name}</Heading>
                  <Text className="!text-sm">{style.description}</Text>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Interests</Heading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interestsData.map(interest => (
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
                  <Text as="span" className="!text-sm !font-medium !text-surface-900">{interest.name}</Text>
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
          <Card className="bg-surface-50 p-6">
            <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Trip Summary</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Trip Name:</Text>
                <Text as="span" className="ml-2 !text-surface-900">{formData.name}</Text>
              </div>
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Group Size:</Text>
                <Text as="span" className="ml-2 !text-surface-900">{formData.groupSize} travelers</Text>
              </div>
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Destinations:</Text>
                <Text as="span" className="ml-2 !text-surface-900">{formData.destinations}</Text>
              </div>
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Duration:</Text>
                <Text as="span" className="ml-2 !text-surface-900">{formData.startDate} - {formData.endDate}</Text>
              </div>
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Budget:</Text>
                <Text as="span" className="ml-2 !text-surface-900">{formData.currency} {formData.budget}</Text>
              </div>
              <div>
                <Text as="span" className="!font-medium !text-surface-700">Travel Style:</Text>
                <Text as="span" className="ml-2 !text-surface-900 capitalize">{formData.travelStyle}</Text>
              </div>
            </div>
            {formData.interests.length > 0 && (
              <div className="mt-4">
                <Text as="span" className="!font-medium !text-surface-700">Interests:</Text>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map(interestId => {
                    const interest = interestsData.find(i => i.id === interestId);
                    return (
                      <span key={interestId} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {interest?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          <Card className="bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Sparkles" className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <Heading level={4} className="!font-medium !text-blue-900">AI-Powered Itinerary</Heading>
                <Text className="!text-sm !text-blue-700 mt-1">
                  Our AI will create a personalized day-by-day itinerary with optimized routes,
                  activity recommendations, and budget tracking.
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-surface-200">
        <Button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className="border border-surface-300 text-surface-700 hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>

        {step < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="bg-primary text-white hover:bg-blue-600"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            icon={loading ? "Loader2" : null}
            className="bg-primary text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            iconClass="w-4 h-4 animate-spin"
          >
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default PlanTripFormSteps;