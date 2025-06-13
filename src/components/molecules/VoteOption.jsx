import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const VoteOption = ({ option, voteCount, totalVotes, userVote, onVote }) => {
  const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  const isUserVote = userVote === option;

  return (
    <div className="relative">
      <Button
        onClick={() => !userVote && onVote(option)}
        disabled={!!userVote}
        className={`w-full text-left p-3 rounded-lg border justify-start !px-3 !py-3 ${
          isUserVote
            ? 'border-primary bg-primary/5 text-primary'
            : userVote
              ? 'border-surface-200 bg-surface-50 text-surface-600 cursor-not-allowed'
              : 'border-surface-200 hover:border-primary hover:bg-surface-50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <Text as="span" className="!font-medium !text-surface-900 break-words">{option}</Text>
          <div className="flex items-center space-x-2">
            <Text as="span" className="!text-sm !text-surface-900">{voteCount}</Text>
            {isUserVote && <ApperIcon name="CheckCircle" size={16} />}
          </div>
        </div>
      </Button>
      <div className="mt-2 bg-surface-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VoteOption;