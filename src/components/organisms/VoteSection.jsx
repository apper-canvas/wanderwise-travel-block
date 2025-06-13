import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';
import VoteOption from '@/components/molecules/VoteOption';

const VoteSection = ({ votes, onCreateVote, onVote }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level={3} className="!text-lg !font-semibold !text-surface-900">Group Decisions</Heading>
        <Button
          onClick={() => onCreateVote(
            'Where should we have dinner on Day 2?',
            ['Italian Restaurant', 'Sushi Place', 'Local Street Food', 'Hotel Restaurant']
          )}
          className="bg-secondary text-white hover:bg-purple-600 !px-4 !py-2"
        >
          Create Vote
        </Button>
      </div>

      {votes.length === 0 ? (
        <EmptyState
          icon="Vote"
          title="No active votes"
          message="Start making group decisions by creating a vote"
          animateIcon={false}
          className="py-8"
        />
      ) : (
        <div className="space-y-4">
          {votes.map((vote, index) => {
            const totalVotes = Object.values(vote.votes).reduce((a, b) => a + b, 0);
            return (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-surface-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <Heading level={4} className="!font-medium !text-surface-900 break-words">{vote.title}</Heading>
                  <Text className="!text-sm">{totalVotes} votes</Text>
                </div>
                <div className="space-y-2">
                  {vote.options.map(option => (
                    <VoteOption
                      key={option}
                      option={option}
                      voteCount={vote.votes[option] || 0}
                      totalVotes={totalVotes}
                      userVote={vote.userVote}
                      onVote={() => onVote(vote.id, option)}
                    />
                  ))}
                </div>
                <Text className="!text-xs !text-surface-500 mt-3">
                  Created by {vote.createdBy} • {vote.createdAt}
                </Text>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default VoteSection;