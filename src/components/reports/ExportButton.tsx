import React from 'react';
import { Download } from 'lucide-react';
import { useAppStore } from '../../store';

interface ExportButtonProps {
  data: any[];
  filename: string;
}

export default function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </button>
  );
}