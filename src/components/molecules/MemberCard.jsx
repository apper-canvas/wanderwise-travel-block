import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';
import Heading from '@/components/atoms/Heading';

const MemberCard = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg"
    >
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white font-medium">
          {member.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <Heading level={5} className="!font-medium !text-surface-900">{member.name}</Heading>
        <Text className="!text-sm">{member.email}</Text>
      </div>
      {member.role === 'organizer' && (
        <div className="px-2 py-1 bg-accent text-white text-xs rounded-full">
          Organizer
        </div>
      )}
    </motion.div>
  );
};

export default MemberCard;