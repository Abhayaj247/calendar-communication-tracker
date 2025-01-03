import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Bell, AlertCircle, Calendar as CalendarIcon, Info, Check } from 'lucide-react';
import { Communication } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { getOverdueCommunications, getTodayCommunications } from '../../utils/communications';
import { completeCommunication, bulkCompleteCommunications } from '../../store/appSlice';

export default function NotificationPanel() {
  const dispatch = useDispatch();
  const { communications, companies, communicationMethods } = useSelector((state: RootState) => state.app);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCommunications, setSelectedCommunications] = useState<string[]>([]);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(timer);
  }, []);

  // Filter communications to only include those with existing companies
  const filteredCommunications = communications.filter(comm => 
    companies.some(company => company.id === comm.companyId)
  );

  const overdueCommunications = getOverdueCommunications(filteredCommunications);
  const todayCommunications = getTodayCommunications(filteredCommunications);

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || 'Unknown Company';
  };

  const getCommunicationMethod = (methodId: string) => {
    return communicationMethods.find((m) => m.id === methodId)?.name || 'Unknown Method';
  };

  const handleCompleteCommunication = (commId: string) => {
    dispatch(completeCommunication(commId));
  };

  const handleBulkComplete = () => {
    dispatch(bulkCompleteCommunications(selectedCommunications));
    setSelectedCommunications([]);
  };

  const toggleCommunicationSelection = (commId: string) => {
    setSelectedCommunications(prev => 
      prev.includes(commId) 
        ? prev.filter(id => id !== commId) 
        : [...prev, commId]
    );
  };

  const renderCommunicationList = (communications: Communication[], title: string, icon: React.ReactNode, bgColor: string) => (
    <div className="mt-6 first:mt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${bgColor} p-2 rounded-lg`}>
            {icon}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {communications.length > 0 && selectedCommunications.length > 0 && (
          <button 
            onClick={handleBulkComplete}
            className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-sm hover:bg-green-600 transition-colors"
          >
            <Check className="h-4 w-4 mr-1" />
            Complete Selected
          </button>
        )}
      </div>
      {communications.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-4">No communications</p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-100">
          {communications.map((comm) => (
            <li 
              key={comm.id} 
              className={`py-4 hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center ${
                selectedCommunications.includes(comm.id) ? 'bg-blue-50' : ''
              }`}
            >
              <input 
                type="checkbox" 
                className="mr-4 ml-4"
                checked={selectedCommunications.includes(comm.id)}
                onChange={() => toggleCommunicationSelection(comm.id)}
              />
              <div className="flex-1 flex items-center justify-between px-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {getCompanyName(comm.companyId)}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {getCommunicationMethod(comm.methodId)}
                  </p>
                </div>
                <div className="flex items-center">
                  <time className="mr-4 text-sm text-gray-500">
                    {format(new Date(comm.date), 'MMM d, yyyy')}
                  </time>
                  <button 
                    onClick={() => handleCompleteCommunication(comm.id)}
                    className="text-green-500 hover:text-green-600 transition-colors"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // If no companies exist, show a different view
  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 flex items-center justify-center flex-col text-center">
          <Info className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Companies Added</h2>
          <p className="text-sm text-gray-500">
            Add your first company to start tracking communications
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center relative">
            <Bell className="h-6 w-6 text-indigo-600" />
            {overdueCommunications.length + todayCommunications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {overdueCommunications.length + todayCommunications.length}
              </span>
            )}
            <h2 className="ml-3 text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
        </div>
        {renderCommunicationList(
          overdueCommunications,
          'Overdue Communications',
          <AlertCircle className="h-5 w-5 text-red-600" />,
          'bg-red-100'
        )}
        {renderCommunicationList(
          todayCommunications,
          "Today's Communications",
          <CalendarIcon className="h-5 w-5 text-yellow-600" />,
          'bg-yellow-100'
        )}
      </div>
    </div>
  );
}