import React from 'react';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const BasicInfoForm = ({ user, preferences, formData, setFormData, editing }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="p-6">
      <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Basic Information</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Full Name">
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
              {user?.name || 'Not set'}
            </div>
          )}
        </FormField>
        <FormField label="Email">
          {editing ? (
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
              {user?.email || 'Not set'}
            </div>
          )}
        </FormField>
        <FormField label="Phone">
          {editing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          ) : (
            <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
              {user?.phone || 'Not set'}
            </div>
          )}
        </FormField>
        <FormField label="Preferred Currency">
          {editing ? (
            <select
              name="preferredCurrency"
              value={formData.preferredCurrency || 'USD'}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          ) : (
            <div className="px-4 py-3 bg-surface-50 rounded-lg text-surface-900">
              {preferences?.preferredCurrency || 'USD'}
            </div>
          )}
        </FormField>
      </div>
    </Card>
  );
};

export default BasicInfoForm;