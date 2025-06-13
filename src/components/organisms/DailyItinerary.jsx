import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import ActivityItem from '@/components/molecules/ActivityItem';

const DailyItinerary = ({ currentDay, tripCurrency, selectedDay, onActivityToggle }) => {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <Heading level={2} className="!text-xl !font-bold !text-surface-900 mb-2">
          Day {selectedDay + 1} - {currentDay.date}
        </Heading>
        <Text className="mb-4">{currentDay.description}</Text>
        <div className="flex items-center space-x-4 text-sm text-surface-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" size={14} />
            <Text as="span">{currentDay.activities.length} activities</Text>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="DollarSign" size={14} />
            <Text as="span">{tripCurrency} {currentDay.estimatedCost}</Text>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {currentDay.activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            tripCurrency={tripCurrency}
            index={index}
            onToggleComplete={onActivityToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyItinerary;