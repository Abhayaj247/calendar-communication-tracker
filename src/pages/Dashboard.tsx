import React, { useState } from 'react';
import { Plus, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import CompanyGrid from '../components/dashboard/CompanyGrid';
import NotificationPanel from '../components/dashboard/NotificationPanel';
import CommunicationForm from '../components/communications/CommunicationForm';

export default function Dashboard() {
  const { companies } = useSelector((state: RootState) => state.app);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [showCommunicationForm, setShowCommunicationForm] = useState(false);

  const handleCompanySelect = (companyId: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId);
    } else {
      newSelected.add(companyId);
    }
    setSelectedCompanies(newSelected);
  };

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center space-x-4">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            </div>
            <p className="mt-3 text-sm text-gray-600 max-w-xl">
              Effortlessly track and manage your company communications with intelligent insights and seamless organization.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowCommunicationForm(true)}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500"
            >
              <span className="relative flex items-center rounded-md bg-white px-4 py-2 transition-all duration-75 ease-in group-hover:bg-opacity-0">
                <Plus className="-ml-0.5 mr-1.5 h-5 w-5 text-indigo-600 group-hover:text-white" />
                New Communication
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
              <CompanyGrid
                companies={companies}
                onSelect={handleCompanySelect}
                selectedCompanies={selectedCompanies}
              />
            </div>
          </div>
          <div>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
              <NotificationPanel />
            </div>
          </div>
        </div>

        {showCommunicationForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-100">
              <button 
                onClick={() => setShowCommunicationForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <Plus className="h-6 w-6 mr-2 text-indigo-600" />
                Log Communication
              </h2>
              <CommunicationForm
                onSubmit={(data) => {
                  // Handle form submission
                  setShowCommunicationForm(false);
                }}
                onCancel={() => setShowCommunicationForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}