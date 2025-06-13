import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const BudgetOverview = ({ selectedTrip, totalSpent, remainingBudget, budgetPercentage }) => {
  if (!selectedTrip) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Budget"
        value={`${selectedTrip.currency} ${selectedTrip.budget.toLocaleString()}`}
        icon="Target"
        bgColorClass="bg-gradient-to-r from-blue-500 to-primary"
        iconColorClass="text-blue-100"
        descriptionColorClass="text-blue-100"
        animate={true}
      />
      <StatCard
        title="Total Spent"
        value={`${selectedTrip.currency} ${totalSpent.toLocaleString()}`}
        icon="Receipt"
        bgColorClass="bg-gradient-to-r from-green-500 to-emerald-600"
        iconColorClass="text-green-100"
        descriptionColorClass="text-green-100"
        description={`${budgetPercentage.toFixed(1)}% of budget`}
        animate={true}
        delay={0.1}
      >
        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all ${
              budgetPercentage > 90 ? 'bg-red-500' :
              budgetPercentage > 75 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
        </div>
      </StatCard>
      <StatCard
        title="Remaining"
        value={`${selectedTrip.currency} ${Math.abs(remainingBudget).toLocaleString()}`}
        icon={remainingBudget >= 0 ? "TrendingUp" : "TrendingDown"}
        bgColorClass="bg-gradient-to-r from-purple-500 to-secondary"
        iconColorClass="text-purple-100"
        valueClass={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-white' : 'text-red-300'}`}
        descriptionColorClass="text-purple-100"
        description={remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
        animate={true}
        delay={0.2}
      />
    </div>
  );
};

export default BudgetOverview;