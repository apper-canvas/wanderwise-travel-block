import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const CollaborateHeader = ({ trips, selectedTripId, onTripChange, onInviteClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={2} className="!text-2xl !font-bold !text-surface-900">Trip Collaboration</Heading>
        <Text>Plan together, vote on activities, and share expenses</Text>
      </div>
      <div className="flex items-center space-x-4">
        <select
          value={selectedTripId || ''}
          onChange={(e) => onTripChange(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {trips.map(trip => (
            <option key={trip.id} value={trip.id}>{trip.name}</option>
          ))}
        </select>
        <Button
          onClick={onInviteClick}
          icon="UserPlus"
          iconSize={16}
          className="bg-primary text-white hover:bg-blue-600 hover:scale-105 !px-4 !py-2"
        >
          Invite
        </Button>
      </div>
    </div>
  );
};

export default CollaborateHeader;