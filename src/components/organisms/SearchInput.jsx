import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchInput = ({ query, setQuery, loading }) => {
  return (
    <div className="relative mb-6">
      <ApperIcon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-4 !text-lg"
        placeholder="Search destinations, hotels, activities..."
      />
      {loading && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <ApperIcon name="Loader2" className="animate-spin text-primary" size={20} />
        </div>
      )}
    </div>
  );
};

export default SearchInput;