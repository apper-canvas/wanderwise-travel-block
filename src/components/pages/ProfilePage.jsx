import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ProfileHeader from '@/components/organisms/ProfileHeader';
import BasicInfoForm from '@/components/organisms/BasicInfoForm';
import NotificationPreferences from '@/components/organisms/NotificationPreferences';
import { userService } from '@/services';

const travelPreferences = [
  { id: 'budget', name: 'Budget Explorer', description: 'Maximize experiences, minimize costs' },
  { id: 'balanced', name: 'Balanced Traveler', description: 'Mix of comfort and adventure' },
  { id: 'luxury', name: 'Luxury Seeker', description: 'Premium experiences and accommodations' },
  { id: 'adventure', name: 'Adventure Seeker', description: 'Thrills and outdoor activities' },
  { id: 'cultural', name: 'Culture Enthusiast', description: 'Museums, history, and local culture' },
  { id: 'relaxation', name: 'Relaxation Focused', description: 'Wellness and peaceful experiences' }
];

const interestsData = [
  { id: 'culture', name: 'Culture & History', icon: 'Museum' },
  { id: 'nature', name: 'Nature & Outdoors', icon: 'Trees' },
  { id: 'food', name: 'Food & Dining', icon: 'UtensilsCrossed' },
  { id: 'nightlife', name: 'Nightlife & Entertainment', icon: 'Music' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag' },
  { id: 'adventure', name: 'Adventure Sports', icon: 'Mountain' },
  { id: 'relaxation', name: 'Relaxation & Wellness', icon: 'Waves' },
  { id: 'photography', name: 'Photography', icon: 'Camera' }
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [userData, preferencesData] = await Promise.all([
          userService.getProfile(),
          userService.getPreferences()
        ]);
        setUser(userData);
        setPreferences(preferencesData);
        setFormData({ ...userData, ...preferencesData });
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      setUser(prev => ({ ...prev, ...formData }));
      setPreferences(prev => ({ ...prev, ...formData }));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleInterestToggle = (interestId) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];

    setFormData(prev => ({ ...prev, interests: newInterests }));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="profile" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <ProfileHeader editing={editing} setEditing={setEditing} />

      <form onSubmit={handleSave} className="space-y-6">
        <BasicInfoForm user={user} preferences={preferences} formData={formData} setFormData={setFormData} editing={editing} />

        {/* Travel Preferences */}
        <Card className="p-6">
          <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Travel Style</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {travelPreferences.map(style => (
              <motion.div
                key={style.id}
                whileHover={{ scale: editing ? 1.02 : 1 }}
                className={`p-4 border-2 rounded-lg transition-all ${
                  (formData.travelStyle || preferences.travelStyle) === style.id
                    ? 'border-primary bg-primary/5'
                    : 'border-surface-200'
                } ${editing ? 'cursor-pointer hover:border-surface-300' : ''}`}
                onClick={() => editing && setFormData(prev => ({ ...prev, travelStyle: style.id }))}
              >
                <Heading level={4} className="!font-medium !text-surface-900 mb-1">{style.name}</Heading>
                <Text className="!text-sm">{style.description}</Text>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Interests */}
        <Card className="p-6">
          <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Interests</Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interestsData.map(interest => {
              const isSelected = (formData.interests || preferences.interests || []).includes(interest.id);
              return (
                <motion.div
                  key={interest.id}
                  whileHover={{ scale: editing ? 1.05 : 1 }}
                  whileTap={editing ? { scale: 0.95 } : {}}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-200'
                  } ${editing ? 'cursor-pointer hover:border-surface-300' : ''}`}
                  onClick={() => editing && handleInterestToggle(interest.id)}
                >
                  <ApperIcon name={interest.icon} className="w-6 h-6 mx-auto mb-2" />
                  <Text as="span" className="!text-sm !font-medium !text-surface-900">{interest.name}</Text>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <NotificationPreferences
          formData={formData}
          preferences={preferences}
          editing={editing}
          setFormData={setFormData}
        />

        {editing && (
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormData({ ...user, ...preferences });
              }}
              className="border border-surface-300 text-surface-700 hover:bg-surface-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-blue-600"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;