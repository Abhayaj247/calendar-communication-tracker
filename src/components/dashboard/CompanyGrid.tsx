import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  TrendingUp, 
  Search, 
  Filter 
} from 'lucide-react';
import { Company, Communication } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface CompanyGridProps {
  companies: Company[];
  onSelect: (companyId: string) => void;
  selectedCompanies: Set<string>;
}

export default function CompanyGrid({
  companies,
  onSelect,
  selectedCompanies,
}: CompanyGridProps) {
  const { communications, communicationMethods } = useSelector((state: RootState) => state.app);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'communications'>('name');

  const getLastFiveCommunications = (companyId: string) => {
    return communications
      .filter((c) => c.companyId === companyId && c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const getNextCommunication = (companyId: string) => {
    return communications
      .filter((c) => c.companyId === companyId && !c.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  };

  const getCommunicationMethod = (methodId: string) => {
    return communicationMethods.find((m) => m.id === methodId)?.name || 'Unknown';
  };

  const getRowHighlight = (company: Company) => {
    const nextComm = getNextCommunication(company.id);
    if (!nextComm) return '';
    
    const today = new Date();
    const commDate = new Date(nextComm.date);
    
    if (commDate < today) return 'bg-red-50/50 hover:bg-red-100/50';
    if (format(commDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return 'bg-yellow-50/50 hover:bg-yellow-100/50';
    return 'hover:bg-gray-50/50';
  };

  const getStatusIcon = (communication: Communication | undefined) => {
    if (!communication) return null;
    const commDate = new Date(communication.date);
    const today = new Date();

    if (commDate < today) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
    if (format(commDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  // Filtered and sorted companies
  const filteredCompanies = companies
    .filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      
      const commA = getLastFiveCommunications(a.id).length;
      const commB = getLastFiveCommunications(b.id).length;
      return commB - commA;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <div className="flex items-center space-x-4">
          <Layers className="h-8 w-8 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Company Overview</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <button 
            onClick={() => setSortBy(prev => prev === 'name' ? 'communications' : 'name')}
            className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm">
              {sortBy === 'name' ? 'Sort by Name' : 'Sort by Communications'}
            </span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-10 pr-3 text-sm font-semibold text-gray-900 text-center">
                Company Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center">
                Last Five Communications
              </th>
              <th scope="col" className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-center">
                Next Communication
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  No companies found
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => {
                const nextComm = getNextCommunication(company.id);
                return (
                  <tr
                    key={company.id}
                    className={`${getRowHighlight(company)} transition-colors duration-150 cursor-pointer group`}
                    onClick={() => onSelect(company.id)}
                  >
                    <td className="whitespace-nowrap py-4 pl-4 pr-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.has(company.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            onSelect(company.id);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-3 font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        {getLastFiveCommunications(company.id).map((comm) => (
                          <span
                            key={comm.id}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 hover:bg-gray-200 transition-colors duration-150"
                            title={comm.notes}
                          >
                            {getCommunicationMethod(comm.methodId)} ({format(new Date(comm.date), 'MMM d')})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(nextComm)}
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          nextComm
                            ? nextComm.date < new Date().toISOString()
                              ? 'bg-red-100 text-red-800'
                              : format(new Date(nextComm.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {nextComm
                            ? `${getCommunicationMethod(nextComm.methodId)} (${format(new Date(nextComm.date), 'MMM d')})`
                            : 'No upcoming communications'
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}