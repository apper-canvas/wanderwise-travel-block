import React from 'react';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const NotificationPreferences = ({ formData, preferences, editing, setFormData }) => {
  const notificationOptions = [
    { id: 'email', name: 'Email Notifications', description: 'Trip updates, booking confirmations, and reminders' },
    { id: 'push', name: 'Push Notifications', description: 'Real-time updates about your trips' },
    { id: 'sms', name: 'SMS Notifications', description: 'Critical updates and flight alerts' },
    { id: 'marketing', name: 'Marketing Emails', description: 'Travel deals and destination recommendations' }
  ];

  return (
    <Card className="p-6">
      <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Notification Preferences</Heading>
      <div className="space-y-4">
        {notificationOptions.map(option => (
          <div key={option.id} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
            <div>
              <Heading level={5} className="!font-medium !text-surface-900">{option.name}</Heading>
              <Text className="!text-sm">{option.description}</Text>
            </div>
            <button
              type="button"
              onClick={() => editing && setFormData(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  [option.id]: !((prev.notifications?.[option.id] !== undefined) ? prev.notifications?.[option.id] : preferences.notifications?.[option.id])
                }
              }))}
              disabled={!editing}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                (formData.notifications?.[option.id] !== undefined) ? formData.notifications?.[option.id] : preferences.notifications?.[option.id]
                  ? 'bg-primary'
                  : 'bg-surface-300'
              } ${editing ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  (formData.notifications?.[option.id] !== undefined) ? formData.notifications?.[option.id] : preferences.notifications?.[option.id]
                    ? 'translate-x-6'
                    : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotificationPreferences;