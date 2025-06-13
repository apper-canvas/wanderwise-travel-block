import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const TripCard = ({ trip, index }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-surface-100 text-surface-600',
  };

  return (
    <Card animate={true} delay={index * 0.1} hoverEffect={true} className="p-6">
      <Link to={`/trip/${trip.id}`} className="block">
        <div className="flex items-center justify-between mb-4">
          <Heading level={3} className="!text-lg !font-semibold !text-surface-900 break-words">
            {trip.name}
          </Heading>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[trip.status]}`}>
            {trip.status}
          </div>
        </div>
        <div className="space-y-2 text-sm text-surface-600">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" size={14} />
            <Text as="span">{trip.dateRange}</Text>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" size={14} />
            <Text as="span" className="break-words">{trip.destinations.join(', ')}</Text>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" size={14} />
            <Text as="span">{trip.currency} {trip.budget.toLocaleString()}</Text>
          </div>
          {trip.members.length > 1 && (
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={14} />
              <Text as="span">{trip.members.length} travelers</Text>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default TripCard;