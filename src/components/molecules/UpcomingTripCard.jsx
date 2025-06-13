import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Heading from '@/components/atoms/Heading';

const UpcomingTripCard = ({ trip, index }) => {
  return (
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
          <Heading level={4} className="!font-medium !text-surface-900 break-words">{trip.name}</Heading>
          <Text className="!text-sm">{trip.dateRange}</Text>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <Text as="p" className="!text-sm !font-medium !text-surface-900 break-words">
            {trip.destinations.join(', ')}
          </Text>
          <Text as="p" className="!text-xs">
            {trip.currency} {trip.budget.toLocaleString()}
          </Text>
        </div>
        <Link
          to={`/trip/${trip.id}`}
          className="p-2 text-primary hover:text-blue-600 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label={`View details for ${trip.name}`}
        >
          <ApperIcon name="ArrowRight" size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default UpcomingTripCard;