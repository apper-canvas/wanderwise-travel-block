import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import PlanTripFormSteps from '@/components/organisms/PlanTripFormSteps';
import { tripService } from '@/services';

const PlanTripPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tripData = {
        ...formData,
        destinations: formData.destinations.split(',').map(d => d.trim()),
        budget: parseFloat(formData.budget),
        groupSize: parseInt(formData.groupSize)
      };

      const newTrip = await tripService.create(tripData);
      toast.success('Trip created successfully! AI is generating your itinerary...');
      navigate(`/trip/${newTrip.id}`);
    } catch (error) {
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <Heading level={1} className="!text-3xl !font-bold !text-surface-900 mb-2">Plan Your Perfect Trip</Heading>
        <Text>Let AI create a personalized itinerary just for you</Text>
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
          <Text as="span" className="!text-sm !text-surface-600">Basic Details</Text>
          <Text as="span" className="!text-sm !text-surface-600">Preferences</Text>
          <Text as="span" className="!text-sm !text-surface-600">Review</Text>
        </div>
      </div>

      <PlanTripFormSteps
        step={step}
        formData={formData}
        handleInputChange={handleInputChange}
        handleInterestToggle={handleInterestToggle}
        setFormData={setFormData}
        loading={loading}
        onSubmit={handleSubmit}
        prevStep={prevStep}
        nextStep={nextStep}
      />
    </div>
  );
};

export default PlanTripPage;