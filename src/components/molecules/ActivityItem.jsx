import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Heading from '@/components/atoms/Heading';
import Button from '@/components/atoms/Button';

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

const ActivityItem = ({ activity, tripCurrency, index, onToggleComplete }) => {
  const icon = activityTypeIcons[activity.type] || activityTypeIcons.other;
  const colorClass = activityTypeColors[activity.type] || activityTypeColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
              <ApperIcon name={icon} size={16} />
            </div>
            <div>
              <Heading level={4} className="!font-semibold !text-surface-900 break-words">{activity.name}</Heading>
              <Text className="!text-sm">{activity.startTime} - {activity.duration} min</Text>
            </div>
          </div>
          <div className="ml-11 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <ApperIcon name="MapPin" size={14} />
              <Text as="span" className="break-words">{activity.location.address}</Text>
            </div>
            <div className="flex items-center space-x-2 text-sm text-surface-600">
              <ApperIcon name="DollarSign" size={14} />
              <Text as="span">{tripCurrency} {activity.cost}</Text>
            </div>
            {activity.description && (
              <Text className="!text-sm break-words">{activity.description}</Text>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={() => onToggleComplete(activity.id, !activity.completed)}
            className={`p-2 rounded-lg ${activity.completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}
            aria-label={activity.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <ApperIcon name={activity.completed ? "CheckCircle" : "Circle"} size={16} />
          </Button>
          <Button
            className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50"
            aria-label="More options"
          >
            <ApperIcon name="MoreHorizontal" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityItem;