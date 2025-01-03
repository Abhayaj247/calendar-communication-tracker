import React, { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addCompany, updateCompany, deleteCompany } from '../store/appSlice';
import CompanyForm from '../components/companies/CompanyForm';
import { Company } from '../types';
import { toast } from 'react-hot-toast';

export default function Companies() {
  const dispatch = useDispatch();
  const { companies } = useSelector((state: RootState) => state.app);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleSubmit = (data: Company) => {
    try {
      if (editingCompany) {
        // If editing an existing company, dispatch update
        dispatch(updateCompany(data));
        toast.success('Company updated successfully');
      } else {
        // If adding a new company, dispatch add
        dispatch(addCompany(data));
        toast.success('Company added successfully');
      }
      setShowCompanyForm(false);
      setEditingCompany(null);
    } catch (error) {
      console.error('Error adding/updating company:', error);
      toast.error('Failed to save company');
    }
  };

  const handleDeleteCompany = (companyId: string) => {
    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm('Are you sure you want to delete this company?');
      
      if (confirmDelete) {
        dispatch(deleteCompany(companyId));
        toast.success('Company deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your company profiles and communication preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setEditingCompany(null);
              setShowCompanyForm(true);
            }}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
            Add Company
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        {companies.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No companies added yet. Click "Add Company" to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {companies.map((company) => (
              <li
                key={company.id}
                className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    setEditingCompany(company);
                    setShowCompanyForm(true);
                  }}
                >
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {company.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {company.location}
                  </p>
                  <div className="mt-1 flex space-x-2">
                    {company.emails.map((email, index) => (
                      <span key={index} className="text-sm text-gray-500">
                        {email}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {company.communicationPeriodicity} days
                  </span>
                  <button
                    onClick={() => {
                      setEditingCompany(company);
                      setShowCompanyForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                    title="Edit Company"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Company"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showCompanyForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </h2>
            <CompanyForm
              initialData={editingCompany}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowCompanyForm(false);
                setEditingCompany(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}