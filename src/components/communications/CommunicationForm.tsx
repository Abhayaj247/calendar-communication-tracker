import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addCommunication, updateCommunication } from '../../store';
import { Communication } from '../../types';

interface CommunicationFormProps {
  initialData?: Communication | null;
  onSubmit: (data: Communication) => void;
  onCancel: () => void;
}

export default function CommunicationForm({
  initialData,
  onSubmit,
  onCancel,
}: CommunicationFormProps) {
  const dispatch = useDispatch();
  const { companies, communicationMethods } = useSelector((state: RootState) => state.app);

  const [formData, setFormData] = useState<Partial<Communication>>(initialData || {
    companyId: '',
    methodId: '',
    date: '',
    notes: '',
    completed: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.companyId || !formData.methodId || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const communicationData: Communication = {
      id: initialData?.id || Date.now().toString(), // Generate new ID if not editing
      ...formData,
    } as Communication;

    // Dispatch appropriate action based on whether we're adding or updating
    if (initialData) {
      dispatch(updateCommunication(communicationData));
    } else {
      dispatch(addCommunication(communicationData));
    }

    // Call onSubmit prop
    onSubmit(communicationData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Dropdown */}
      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <select
          id="companyId"
          value={formData.companyId || ''}
          onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Communication Method Dropdown */}
      <div>
        <label htmlFor="methodId" className="block text-sm font-medium text-gray-700">
          Communication Method
        </label>
        <select
          id="methodId"
          value={formData.methodId || ''}
          onChange={(e) => setFormData({ ...formData, methodId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a method</option>
          {communicationMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date || ''}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Notes Textarea */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Completed Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="completed"
          checked={formData.completed || false}
          onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
          Completed
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {initialData ? 'Update' : 'Add'} Communication
        </button>
      </div>
    </form>
  );
}