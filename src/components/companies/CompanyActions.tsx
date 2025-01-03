import React from 'react';
import { Trash2, Edit, Mail, Phone } from 'lucide-react';
import { Company } from '../../types';
import { useAppStore } from '../../store';

interface CompanyActionsProps {
  company: Company;
  onEdit: () => void;
}

export default function CompanyActions({ company, onEdit }: CompanyActionsProps) {
  const { deleteCompany } = useAppStore();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      deleteCompany(company.id);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
      >
        <Edit className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="p-2 text-red-400 hover:text-red-500 rounded-full hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}