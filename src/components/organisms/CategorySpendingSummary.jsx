import React from 'react';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import CategoryChip from '@/components/molecules/CategoryChip';

const CategorySpendingSummary = ({ expensesByCategory, currency }) => {
  return (
    <Card className="p-6">
      <Heading level={3} className="!text-lg !font-semibold !text-surface-900 mb-4">
        Spending by Category
      </Heading>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {expensesByCategory.map((category, index) => (
          <CategoryChip
            key={category.id}
            category={category}
            currency={currency}
            index={index}
          />
        ))}
      </div>
    </Card>
  );
};

export default CategorySpendingSummary;