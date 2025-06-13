import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { expenseService, tripService } from '../services'

const Budget = () => {
  const [expenses, setExpenses] = useState([])
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'dining',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  const categories = [
    { id: 'flights', name: 'Flights', icon: 'Plane', color: 'bg-blue-100 text-blue-600' },
    { id: 'accommodation', name: 'Accommodation', icon: 'Bed', color: 'bg-green-100 text-green-600' },
    { id: 'dining', name: 'Dining', icon: 'UtensilsCrossed', color: 'bg-orange-100 text-orange-600' },
    { id: 'activities', name: 'Activities', icon: 'Camera', color: 'bg-purple-100 text-purple-600' },
    { id: 'transport', name: 'Transport', icon: 'Car', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-100 text-pink-600' },
    { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'bg-surface-100 text-surface-600' }
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [tripsData, expensesData] = await Promise.all([
          tripService.getAll(),
          expenseService.getAll()
        ])
        setTrips(tripsData)
        setExpenses(expensesData)
        if (tripsData.length > 0) {
          setSelectedTrip(tripsData[0])
        }
      } catch (err) {
        setError(err.message || 'Failed to load budget data')
        toast.error('Failed to load budget data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!selectedTrip) return

    try {
      const expenseData = {
        ...newExpense,
        tripId: selectedTrip.id,
        amount: parseFloat(newExpense.amount),
        paidBy: { id: 'user1', name: 'You' },
        splitWith: []
      }
      
      const createdExpense = await expenseService.create(expenseData)
      setExpenses(prev => [createdExpense, ...prev])
      setNewExpense({
        amount: '',
        category: 'dining',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowAddExpense(false)
      toast.success('Expense added successfully')
    } catch (err) {
      toast.error('Failed to add expense')
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseService.delete(expenseId)
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId))
      toast.success('Expense deleted')
    } catch (err) {
      toast.error('Failed to delete expense')
    }
  }

  const filteredExpenses = selectedTrip 
    ? expenses.filter(expense => expense.tripId === selectedTrip.id)
    : []

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = filteredExpenses.filter(expense => expense.category === category.id)
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return { ...category, total, count: categoryExpenses.length }
  })

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = selectedTrip ? selectedTrip.budget - totalSpent : 0
  const budgetPercentage = selectedTrip ? (totalSpent / selectedTrip.budget) * 100 : 0

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
                <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-surface-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load budget</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="DollarSign" className="w-16 h-16 text-surface-300 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-surface-900 mb-2">No trips to track</h3>
          <p className="text-surface-600 mb-6">Create a trip first to start tracking your expenses</p>
          <button
            onClick={() => navigate('/plan-trip')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Plan Your First Trip
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Budget Tracker</h1>
          <p className="text-surface-600">Monitor your travel expenses and stay within budget</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => {
              const trip = trips.find(t => t.id === e.target.value)
              setSelectedTrip(trip)
            }}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddExpense(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {selectedTrip && (
        <>
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Total Budget</h3>
                <ApperIcon name="Target" className="w-5 h-5 text-surface-600" />
              </div>
              <div className="text-2xl font-bold text-surface-900">
                {selectedTrip.currency} {selectedTrip.budget.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Total Spent</h3>
                <ApperIcon name="Receipt" className="w-5 h-5 text-surface-600" />
              </div>
              <div className="text-2xl font-bold text-surface-900">
                {selectedTrip.currency} {totalSpent.toLocaleString()}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-surface-600 mb-1">
                  <span>{budgetPercentage.toFixed(1)}% of budget</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budgetPercentage > 90 ? 'bg-red-500' :
                      budgetPercentage > 75 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-surface-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-surface-900">Remaining</h3>
                <ApperIcon name={remainingBudget >= 0 ? "TrendingUp" : "TrendingDown"} 
                          className={`w-5 h-5 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedTrip.currency} {Math.abs(remainingBudget).toLocaleString()}
              </div>
              <div className="text-sm text-surface-600 mt-1">
                {remainingBudget >= 0 ? 'Under budget' : 'Over budget'}
              </div>
            </motion.div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {expensesByCategory.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-center p-4 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}>
                    <ApperIcon name={category.icon} size={20} />
                  </div>
                  <div className="text-sm font-medium text-surface-900">{category.name}</div>
                  <div className="text-xs text-surface-600 mt-1">
                    {selectedTrip.currency} {category.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-surface-500">
                    {category.count} {category.count === 1 ? 'expense' : 'expenses'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Recent Expenses</h3>
              <div className="text-sm text-surface-600">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
              </div>
            </div>
            
            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Receipt" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                <h4 className="font-medium text-surface-900 mb-2">No expenses yet</h4>
                <p className="text-surface-600 mb-4">Start tracking your travel expenses</p>
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add First Expense
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExpenses.slice(0, 10).map((expense, index) => {
                  const category = categories.find(c => c.id === expense.category)
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${category?.color} flex items-center justify-center`}>
                          <ApperIcon name={category?.icon || 'MoreHorizontal'} size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-surface-900 break-words">
                            {expense.description || category?.name}
                          </div>
                          <div className="text-sm text-surface-600">{expense.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-semibold text-surface-900">
                            {selectedTrip.currency} {expense.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-surface-600">
                            {expense.paidBy.name}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-2 text-surface-600 hover:text-red-600 rounded-lg hover:bg-surface-200 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Add Expense</h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-2 text-surface-600 hover:text-surface-900 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({...prev, amount: e.target.value}))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({...prev, description: e.target.value}))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="What did you spend on?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense(prev => ({...prev, date: e.target.value}))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Budget