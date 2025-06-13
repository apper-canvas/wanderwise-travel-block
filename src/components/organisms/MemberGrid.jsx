import React from 'react';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import MemberCard from '@/components/molecules/MemberCard';

const MemberGrid = ({ members }) => {
  return (
    <Card className="p-6">
      <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">Trip Members</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, index) => (
          <MemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </Card>
  );
};

export default MemberGrid;