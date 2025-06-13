import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const itemTypeIcons = {
  flight: 'Plane',
  hotel: 'Bed',
  activity: 'Camera',
  restaurant: 'UtensilsCrossed',
  other: 'MapPin',
};

const itemTypeColors = {
  flight: 'bg-blue-100 text-blue-600',
  hotel: 'bg-green-100 text-green-600',
  activity: 'bg-purple-100 text-purple-600',
  restaurant: 'bg-orange-100 text-orange-600',
  other: 'bg-surface-100 text-surface-600',
};

const SearchResultsList = ({ results, onBookItem }) => {
  return (
    <div className="space-y-4">
      {results.map((item, index) => (
        <Card key={item.id} animate={true} delay={index * 0.1} hoverEffect={true} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${itemTypeColors[item.type] || itemTypeColors.other}`}>
                <ApperIcon name={itemTypeIcons[item.type] || itemTypeIcons.other} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-1 break-words">
                  {item.name}
                </Heading>
                <Text className="mb-2 break-words">{item.description}</Text>
                <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="MapPin" size={14} />
                    <Text as="span" className="break-words">{item.location}</Text>
                  </div>
                  {item.rating && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" size={14} className="text-yellow-500" />
                      <Text as="span">{item.rating}</Text>
                    </div>
                  )}
                  {item.provider && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Building" size={14} />
                      <Text as="span">{item.provider}</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-6 text-right">
              <Heading level={2} className="!text-2xl !font-bold !text-surface-900 mb-1">
                ${item.price}
              </Heading>
              {item.originalPrice && item.originalPrice > item.price && (
                <Text className="!text-sm !text-surface-500 line-through mb-2">
                  ${item.originalPrice}
                </Text>
              )}
              <Button
                onClick={() => onBookItem(item)}
                className="bg-primary text-white hover:bg-blue-600 hover:scale-105 whitespace-nowrap !px-4 !py-2"
              >
                Book Now
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SearchResultsList;