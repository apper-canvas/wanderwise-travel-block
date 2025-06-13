import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { tripService, itineraryService, activityService } from '@/services';
import TripDetailsHeader from '@/components/organisms/TripDetailsHeader';
import DayNavigation from '@/components/organisms/DayNavigation';
import DailyItinerary from '@/components/organisms/DailyItinerary';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import AlertCard from '@/components/molecules/AlertCard';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, map, budget

  useEffect(() => {
    const loadTripData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripData, itineraryData] = await Promise.all([
          tripService.getById(id),
          itineraryService.getByTripId(id)
        ]);
        setTrip(tripData);
        setItinerary(itineraryData);
      } catch (err) {
        setError(err.message || 'Failed to load trip details');
        toast.error('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    loadTripData();
  }, [id]);

  const handleActivityToggle = async (activityId, completed) => {
    try {
      await activityService.update(activityId, { completed });
      setItinerary(prev => ({
        ...prev,
        days: prev.days.map(day => ({
          ...day,
          activities: day.activities.map(activity =>
            activity.id === activityId ? { ...activity, completed } : activity
          )
        }))
      }));
      toast.success(completed ? 'Activity completed!' : 'Activity unmarked');
    } catch (err) {
      toast.error('Failed to update activity');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="trip-details" />
      </div>
    );
  }

  if (error) {
    return (
      <AlertCard
        icon="AlertCircle"
        title="Trip not found"
        message={error}
        buttonText="Back to Dashboard"
        onButtonClick={() => navigate('/dashboard')}
        iconColorClass="text-red-500"
      />
    );
  }

  if (!trip || !itinerary) {
    return (
      <AlertCard
        icon="MapPin"
        title="Trip not found"
        message="The trip you're looking for doesn't exist or has been removed."
        buttonText="Back to Dashboard"
        onButtonClick={() => navigate('/dashboard')}
        iconColorClass="text-surface-300"
      />
    );
  }

  const currentDay = itinerary.days[selectedDay];

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <TripDetailsHeader
        trip={trip}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onBackClick={() => navigate('/dashboard')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DayNavigation
          itinerary={itinerary}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        <div className="lg:col-span-3">
          {viewMode === 'timeline' && currentDay && (
            <DailyItinerary
              currentDay={currentDay}
              tripCurrency={trip.currency}
              selectedDay={selectedDay}
              onActivityToggle={handleActivityToggle}
            />
          )}

          {viewMode === 'map' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Heading level={2} className="!text-xl !font-bold !text-surface-900">Trip Map</Heading>
                <Text className="!text-sm">{`Day ${selectedDay + 1} locations`}</Text>
              </div>
              <div className="bg-surface-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <ApperIcon name="Map" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                  <Heading level={3} className="!text-lg !font-medium !text-surface-900 mb-2">Interactive Map</Heading>
                  <Text>
                    Map integration would show all locations for {currentDay?.date} with optimized routing
                  </Text>
                  <Text className="!text-sm !text-surface-500 mt-4">
                    Would integrate with Google Maps or Mapbox for real implementation
                  </Text>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;