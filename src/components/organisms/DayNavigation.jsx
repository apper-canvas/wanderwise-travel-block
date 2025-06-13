import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';

const DayNavigation = ({ itinerary, selectedDay, setSelectedDay }) => {
  return (
    <div className="lg:col-span-1">
      <Card className="p-4">
        <Heading level={3} className="!font-semibold !text-surface-900 mb-4">Days</Heading>
        <div className="space-y-2">
          {itinerary.days.map((day, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDay(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedDay === index
                  ? 'bg-primary text-white'
                  : 'text-surface-700 hover:bg-surface-50'
              }`}
            >
              <Text as="div" className="!font-medium !text-white !opacity-100 !text-surface-900">{`Day ${index + 1}`}</Text>
              <Text as="div" className="!text-sm opacity-75 !text-surface-700">{day.date}</Text>
              <Text as="div" className="!text-xs opacity-75 mt-1 !text-surface-700">
                {day.activities.length} activities
              </Text>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DayNavigation;