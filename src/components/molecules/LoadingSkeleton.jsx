import React from 'react';
import Card from '@/components/atoms/Card';

const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
              <div className="ml-6">
                <div className="h-8 bg-surface-200 rounded w-20"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[...Array(count)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-surface-200 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (type === 'profile') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-surface-200 rounded w-full"></div>
            <div className="h-3 bg-surface-200 rounded w-2/3"></div>
          </div>
        </Card>
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-surface-200 rounded w-full"></div>
            <div className="h-3 bg-surface-200 rounded w-2/3"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (type === 'trip-details') {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-surface-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-200 rounded w-full"></div>
                  <div className="h-3 bg-surface-200 rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Card className="p-6 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-surface-200 rounded"></div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'collaborate') {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-surface-200 rounded w-full"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;