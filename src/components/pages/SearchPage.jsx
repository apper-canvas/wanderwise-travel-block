import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import SearchInput from '@/components/organisms/SearchInput';
import SearchFilterBar from '@/components/organisms/SearchFilterBar';
import SearchResultsList from '@/components/organisms/SearchResultsList';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import { searchService } from '@/services';

const filters = [
  { id: 'all', name: 'All', icon: 'Search' },
  { id: 'flights', name: 'Flights', icon: 'Plane' },
  { id: 'hotels', name: 'Hotels', icon: 'Bed' },
  { id: 'activities', name: 'Activities', icon: 'Camera' },
  { id: 'restaurants', name: 'Restaurants', icon: 'UtensilsCrossed' }
];

const sortOptions = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'price-low', name: 'Price: Low to High' },
  { id: 'price-high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Rating' },
  { id: 'distance', name: 'Distance' }
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [query, activeFilter, sortBy]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await searchService.search({
        query,
        type: activeFilter,
        sortBy
      });
      setResults(searchResults);
    } catch (err) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookItem = async (item) => {
    try {
      await searchService.book(item.id);
      toast.success(`${item.name} booking initiated!`);
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <Heading level={2} className="!text-2xl !font-bold !text-surface-900 mb-2">Search Travel Options</Heading>
        <Text className="mb-6">Find flights, hotels, activities and more from multiple providers</Text>

        <SearchInput query={query} setQuery={setQuery} loading={loading} />

        <SearchFilterBar
          filters={filters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOptions={sortOptions}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="space-y-4">
          {loading && query.length > 2 && <LoadingSkeleton type="card" count={3} />}

          {!loading && results.length === 0 && query.length > 2 && (
            <EmptyState
              icon="SearchX"
              title="No results found"
              message="Try adjusting your search or filters to find what you're looking for"
              animateIcon={false}
              className="py-12"
            />
          )}

          {!loading && query.length <= 2 && (
            <EmptyState
              icon="Globe"
              title="Start your search"
              message="Enter at least 3 characters to search for flights, hotels, activities and more"
              animateIcon={false}
              className="py-12"
            />
          )}

          {!loading && results.length > 0 && (
            <SearchResultsList results={results} onBookItem={handleBookItem} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;