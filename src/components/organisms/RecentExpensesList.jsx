import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

const categoryColors = {
  flights: 'bg-blue-100 text-blue-600',
  accommodation: 'bg-green-100 text-green-600',
  dining: 'bg-orange-100 text-orange-600',
  activities: 'bg-purple-100 text-purple-600',
  transport: 'bg-indigo-100 text-indigo-600',
  shopping: 'bg-pink-100 text-pink-600',
  other: 'bg-surface-100 text-surface-600',
};

const categoryIcons = {
  flights: 'Plane',
  accommodation: 'Bed',
  dining: 'UtensilsCrossed',
  activities: 'Camera',
  transport: 'Car',
  shopping: 'ShoppingBag',
  other: 'MoreHorizontal',
};

const RecentExpensesList = ({ expenses, currency, onAddExpenseClick, onDeleteExpense }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level={3} className="!text-lg !font-semibold !text-surface-900">Recent Expenses</Heading>
        <Text className="!text-sm !text-surface-600">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </Text>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          icon="Receipt"
          title="No expenses yet"
          message="Start tracking your travel expenses"
          buttonText="Add First Expense"
          onButtonClick={onAddExpenseClick}
          animateIcon={false}
          className="py-8"
        />
      ) : (
        <div className="space-y-3">
          {expenses.slice(0, 10).map((expense, index) => {
            const colorClass = categoryColors[expense.category] || categoryColors.other;
            const icon = categoryIcons[expense.category] || categoryIcons.other;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                    <ApperIcon name={icon} size={16} />
                  </div>
                  <div>
                    <Text as="div" className="!font-medium !text-surface-900 break-words">
                      {expense.description || categoryColors[expense.category]?.name}
                    </Text>
                    <Text className="!text-sm">{expense.date}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Text as="div" className="!font-semibold !text-surface-900">
                      {currency} {expense.amount.toLocaleString()}
                    </Text>
                    <Text className="!text-xs">
                      {expense.paidBy.name}
                    </Text>
                  </div>
                  <Button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-2 text-surface-600 hover:text-red-600 rounded-lg hover:bg-surface-200"
                    aria-label="Delete expense"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentExpensesList;