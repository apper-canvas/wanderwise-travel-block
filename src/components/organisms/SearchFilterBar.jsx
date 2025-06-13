import React from 'react';
import FilterButton from '@/components/molecules/FilterButton';

const SearchFilterBar = ({ filters, activeFilter, setActiveFilter, sortOptions, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <FilterButton
            key={filter.id}
            id={filter.id}
            name={filter.name}
            icon={filter.icon}
            isActive={activeFilter === filter.id}
            onClick={setActiveFilter}
          />
        ))}
      </div>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {sortOptions.map(option => (
          <option key={option.id} value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;