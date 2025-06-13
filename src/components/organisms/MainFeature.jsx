import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import StatCard from '@/components/molecules/StatCard';
import UpcomingTripCard from '@/components/molecules/UpcomingTripCard';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import { tripService, itineraryService } from '@/services';

const activityTypeIcons = {
  flight: 'Plane',
  hotel: 'Bed',
  attraction: 'Camera',
  dining: 'UtensilsCrossed',
  other: 'MapPin',
};

const activityTypeColors = {
  flight: 'bg-blue-100 text-blue-600',
  hotel: 'bg-green-100 text-green-600',
  attraction: 'bg-purple-100 text-purple-600',
  dining: 'bg-orange-100 text-orange-600',
  other: 'bg-surface-100 text-surface-600',
};

const MainFeature = () => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    nextTrip: null
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const trips = await tripService.getAll();

        // Find active trip (current or most recent)
        const active = trips.find(trip => trip.status === 'active') || trips[0];
        setActiveTrip(active);

        // Get upcoming trips
        const upcoming = trips.filter(trip => trip.status === 'upcoming').slice(0, 3);
        setUpcomingTrips(upcoming);

        // Get today's activities if there's an active trip
        if (active) {
          const itinerary = await itineraryService.getByTripId(active.id);
          const today = new Date().toISOString().split('T')[0];
          const todayItinerary = itinerary.days.find(day => day.date === today);
          setTodayActivities(todayItinerary?.activities || []);
        }

        // Calculate quick stats
        const totalSpent = trips.reduce((sum, trip) => sum + (trip.spent || 0), 0);
        const nextTrip = trips.find(trip => trip.status === 'upcoming');

        setQuickStats({
          totalTrips: trips.length,
          totalSpent,
          nextTrip
        });
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCompleteActivity = async (activityId) => {
    try {
      // In a real app, this would call an API
      const updatedActivities = todayActivities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      );
      setTodayActivities(updatedActivities);
      toast.success('Activity updated!');
    } catch (err) {
      toast.error('Failed to update activity');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="main-feature" />;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Trips"
          value={quickStats.totalTrips}
          icon="MapPin"
          bgColorClass="bg-gradient-to-r from-blue-500 to-primary"
          iconColorClass="text-blue-100"
          descriptionColorClass="text-blue-100"
          animate={true}
        />

        <StatCard
          title="Total Spent"
          value={`$${quickStats.totalSpent.toLocaleString()}`}
          icon="DollarSign"
          bgColorClass="bg-gradient-to-r from-green-500 to-emerald-600"
          iconColorClass="text-green-100"
          descriptionColorClass="text-green-100"
          animate={true}
          delay={0.1}
        />

        <StatCard
          title="Next Trip"
          value={quickStats.nextTrip ? quickStats.nextTrip.name : 'None planned'}
          icon="Calendar"
          bgColorClass="bg-gradient-to-r from-purple-500 to-secondary"
          iconColorClass="text-purple-100"
          descriptionColorClass="text-purple-100"
          animate={true}
          delay={0.2}
        />
      </div>

      {/* Today's Schedule */}
      {activeTrip && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading level={3} className="!text-lg !font-semibold !text-surface-900">Today's Schedule</Heading>
              <Text as="p" className="!text-sm break-words">
                {activeTrip.name} • {new Date().toLocaleDateString()}
              </Text>
            </div>
            <Link
              to={`/trip/${activeTrip.id}`}
              className="text-primary hover:text-blue-600 text-sm font-medium"
            >
              View Full Trip
            </Link>
          </div>

          {todayActivities.length === 0 ? (
            <EmptyState
              icon="Calendar"
              title="No activities"
              message="No activities scheduled for today"
              animateIcon={false}
              className="py-8"
            />
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
                      activityTypeColors[activity.type] || activityTypeColors.other
                    }`}>
                      <ApperIcon name={activityTypeIcons[activity.type] || activityTypeIcons.other} size={18} />
                    </div>
                    <div>
                      <Heading level={4} className={`!font-medium ${
                        activity.completed ? 'text-green-800 line-through' : 'text-surface-900'
                      } break-words`}>
                        {activity.name}
                      </Heading>
                      <Text className="!text-sm">
                        {activity.startTime} • {activity.duration} min
                      </Text>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Text as="span" className="!text-sm !font-medium !text-surface-900">
                      ${activity.cost}
                    </Text>
                    <Button
                      onClick={() => handleCompleteActivity(activity.id)}
                      className={`p-2 rounded-lg ${
                        activity.completed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                      aria-label={activity.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <ApperIcon name={activity.completed ? "CheckCircle" : "Circle"} size={16} />
                    </Button>
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
        </Card>
      )}

      {/* Upcoming Trips */}
      {upcomingTrips.length > 0 && (
        <Card className="p-6">
          <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Upcoming Trips</Heading>
          <div className="space-y-3">
            {upcomingTrips.map((trip, index) => (
              <UpcomingTripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/plan-trip"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Plus" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <Text as="span" className="!text-sm !font-medium !text-surface-900 group-hover:text-primary">
              Plan Trip
            </Text>
          </Link>
          <Link
            to="/search"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Search" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <Text as="span" className="!text-sm !font-medium !text-surface-900 group-hover:text-primary">
              Search
            </Text>
          </Link>
          <Link
            to="/budget"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="DollarSign" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <Text as="span" className="!text-sm !font-medium !text-surface-900 group-hover:text-primary">
              Budget
            </Text>
          </Link>
          <Link
            to="/collaborate"
            className="flex flex-col items-center p-4 rounded-lg border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ApperIcon name="Users" className="w-8 h-8 text-surface-600 group-hover:text-primary mb-2" />
            <Text as="span" className="!text-sm !font-medium !text-surface-900 group-hover:text-primary">
              Collaborate
            </Text>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default MainFeature;