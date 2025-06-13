import { delay } from '../index'
import expensesData from '../mockData/expenses.json'

class ExpenseService {
  constructor() {
    this.expenses = [...expensesData]
  }

  async getAll() {
    await delay(300)
    return [...this.expenses]
  }

  async getById(id) {
    await delay(200)
    const expense = this.expenses.find(expense => expense.id === id)
    if (!expense) {
      throw new Error('Expense not found')
    }
    return { ...expense }
  }

  async getByTripId(tripId) {
    await delay(300)
    const tripExpenses = this.expenses.filter(expense => expense.tripId === tripId)
    return [...tripExpenses]
  }

  async create(expenseData) {
    await delay(400)
    const newExpense = {
      id: `expense_${Date.now()}`,
      ...expenseData,
      createdAt: new Date().toISOString()
    }
    this.expenses.unshift(newExpense)
    return { ...newExpense }
  }

  async update(id, data) {
    await delay(300)
    const index = this.expenses.findIndex(expense => expense.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    this.expenses[index] = { ...this.expenses[index], ...data }
    return { ...this.expenses[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.expenses.findIndex(expense => expense.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    this.expenses.splice(index, 1)
    return true
  }
}

export default new ExpenseService()