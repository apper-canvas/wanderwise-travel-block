import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import AlertCard from '@/components/molecules/AlertCard';
import EmptyState from '@/components/molecules/EmptyState';
import BudgetOverview from '@/components/organisms/BudgetOverview';
import CategorySpendingSummary from '@/components/organisms/CategorySpendingSummary';
import RecentExpensesList from '@/components/organisms/RecentExpensesList';
import AddExpenseForm from '@/components/organisms/AddExpenseForm';
import { expenseService, tripService } from '@/services';

const categories = [
  { id: 'flights', name: 'Flights', icon: 'Plane', color: 'bg-blue-100 text-blue-600' },
  { id: 'accommodation', name: 'Accommodation', icon: 'Bed', color: 'bg-green-100 text-green-600' },
  { id: 'dining', name: 'Dining', icon: 'UtensilsCrossed', color: 'bg-orange-100 text-orange-600' },
  { id: 'activities', name: 'Activities', icon: 'Camera', color: 'bg-purple-100 text-purple-600' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-indigo-100 text-indigo-600' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'bg-surface-100 text-surface-600' }
];

const BudgetPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'dining',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tripsData, expensesData] = await Promise.all([
          tripService.getAll(),
          expenseService.getAll()
        ]);
        setTrips(tripsData);
        setExpenses(expensesData);
        if (tripsData.length > 0) {
          setSelectedTrip(tripsData[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load budget data');
        toast.error('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      const expenseData = {
        ...newExpense,
        tripId: selectedTrip.id,
        amount: parseFloat(newExpense.amount),
        paidBy: { id: 'user1', name: 'You' }, // Mock user
        splitWith: [] // For future shared expenses feature
      };

      const createdExpense = await expenseService.create(expenseData);
      setExpenses(prev => [createdExpense, ...prev]);
      setNewExpense({
        amount: '',
        category: 'dining',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddExpense(false);
      toast.success('Expense added successfully');
    } catch (err) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.delete(expenseId);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
      toast.success('Expense deleted');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const filteredExpenses = selectedTrip
    ? expenses.filter(expense => expense.tripId === selectedTrip.id)
    : [];

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = filteredExpenses.filter(expense => expense.category === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { ...category, total, count: categoryExpenses.length };
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = selectedTrip ? selectedTrip.budget - totalSpent : 0;
  const budgetPercentage = selectedTrip ? (totalSpent / selectedTrip.budget) * 100 : 0;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <LoadingSkeleton type="stat" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <AlertCard
        icon="AlertCircle"
        iconColorClass="text-red-500"
        title="Failed to load budget"
        message={error}
        buttonText="Try Again"
        onButtonClick={() => window.location.reload()}
      />
    );
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        icon="DollarSign"
        title="No trips to track"
        message="Create a trip first to start tracking your expenses"
        buttonText="Plan Your First Trip"
        onButtonClick={() => navigate('/plan-trip')}
        animateIcon={true}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="!text-2xl !font-bold !text-surface-900">Budget Tracker</Heading>
          <Text>Monitor your travel expenses and stay within budget</Text>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => {
              const trip = trips.find(t => t.id === e.target.value);
              setSelectedTrip(trip);
            }}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
            ))}
          </select>
          <Button
            onClick={() => setShowAddExpense(true)}
            icon="Plus"
            iconSize={16}
            className="bg-primary text-white hover:bg-blue-600 hover:scale-105 !px-4 !py-2"
          >
            Add Expense
          </Button>
        </div>
      </div>

      {selectedTrip && (
        <>
          <BudgetOverview
            selectedTrip={selectedTrip}
            totalSpent={totalSpent}
            remainingBudget={remainingBudget}
            budgetPercentage={budgetPercentage}
          />
          <CategorySpendingSummary
            expensesByCategory={expensesByCategory}
            currency={selectedTrip.currency}
          />
          <RecentExpensesList
            expenses={filteredExpenses}
            currency={selectedTrip.currency}
            onAddExpenseClick={() => setShowAddExpense(true)}
            onDeleteExpense={handleDeleteExpense}
          />
        </>
      )}

      <AddExpenseForm
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        onSubmit={handleAddExpense}
        categories={categories}
      />
    </div>
  );
};

export default BudgetPage;