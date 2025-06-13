import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ProfileHeader = ({ editing, setEditing }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={2} className="!text-2xl !font-bold !text-surface-900">Profile & Preferences</Heading>
        <Text>Customize your travel planning experience</Text>
      </div>
      <Button
        onClick={() => setEditing(!editing)}
        icon={editing ? "X" : "Edit"}
        iconSize={16}
        className="bg-primary text-white hover:bg-blue-600 hover:scale-105 !px-4 !py-2"
      >
        {editing ? "Cancel" : "Edit Profile"}
      </Button>
    </div>
  );
};

export default ProfileHeader;