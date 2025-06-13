import React from 'react';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const AddExpenseForm = ({
  isOpen,
  onClose,
  newExpense,
  setNewExpense,
  onSubmit,
  categories
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Amount"
          type="number"
          step="0.01"
          name="amount"
          value={newExpense.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          required
        />
        <FormField label="Category">
          <select
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Description"
          type="text"
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
          placeholder="What did you spend on?"
        />
        <FormField
          label="Date"
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleInputChange}
          required
        />
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 border border-surface-300 text-surface-700 hover:bg-surface-50 !px-4 !py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-blue-600 !px-4 !py-2"
          >
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseForm;