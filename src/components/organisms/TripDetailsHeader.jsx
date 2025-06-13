import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const TripDetailsHeader = ({ trip, viewMode, setViewMode, onBackClick }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-surface-100 text-surface-600',
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <Button
            onClick={onBackClick}
            className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50"
            aria-label="Back to dashboard"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <Heading level={2} className="!text-2xl !font-bold !text-surface-900 break-words">{trip.name}</Heading>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[trip.status]}`}>
            {trip.status}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-surface-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <Text as="span">{trip.dateRange}</Text>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="MapPin" size={14} />
            <Text as="span" className="break-words">{trip.destinations.join(', ')}</Text>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Users" size={14} />
            <Text as="span">{trip.members.length} travelers</Text>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setViewMode('timeline')}
          icon="Clock"
          iconSize={16}
          className={`px-3 py-2 text-sm font-medium ${
            viewMode === 'timeline' ? 'bg-primary text-white' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
          }`}
        >
          Timeline
        </Button>
        <Button
          onClick={() => setViewMode('map')}
          icon="Map"
          iconSize={16}
          className={`px-3 py-2 text-sm font-medium ${
            viewMode === 'map' ? 'bg-primary text-white' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
          }`}
        >
          Map
        </Button>
      </div>
    </div>
  );
};

export default TripDetailsHeader;