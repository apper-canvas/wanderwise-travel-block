import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
        <Heading level={1} className="!text-3xl !font-bold !text-surface-900 mb-4">
          Looks like you're off the map!
        </Heading>
        <Text className="mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </Text>
        <Button
          as={Link}
          to="/dashboard"
          icon="Home"
          iconSize={16}
          className="bg-primary text-white hover:bg-blue-600"
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;