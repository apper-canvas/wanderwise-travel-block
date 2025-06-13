import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MainFeature from '@/components/organisms/MainFeature';
import TripCard from '@/components/molecules/TripCard';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import EmptyState from '@/components/molecules/EmptyState';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import AlertCard from '@/components/molecules/AlertCard';
import { tripService } from '@/services';

const DashboardPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await tripService.getAll();
        setTrips(result);
      } catch (err) {
        setError(err.message || 'Failed to load trips');
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="dashboard" /> {/* Placeholder for dashboard specific skeleton if needed, else 'stat' or 'card' */}
      </div>
    );
  }

  if (error) {
    return (
      <AlertCard
        icon="AlertCircle"
        iconColorClass="text-red-500"
        title="Something went wrong"
        message={error}
        buttonText="Try Again"
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="!text-2xl !font-bold !text-surface-900">Your Trips</Heading>
          <Text>Plan, track, and enjoy your adventures</Text>
        </div>
        <Button
          as={Link}
          to="/plan-trip"
          icon="Plus"
          iconSize={16}
          className="bg-primary text-white hover:bg-blue-600 hover:scale-105"
        >
          Plan New Trip
        </Button>
      </div>

      <MainFeature />

      {trips.length === 0 ? (
        <EmptyState
          icon="MapPin"
          title="Ready for your next adventure?"
          message="Create your first trip and let AI plan the perfect itinerary"
          buttonText="Start Planning"
          onButtonClick={() => {/* Link will handle navigation: /plan-trip */}}
          animateIcon={true}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;