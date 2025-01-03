import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getOverdueCommunications, getTodayCommunications } from '../utils/communications';
import Navigation from './navigation/Navigation';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { communications, companies } = useSelector((state: RootState) => state.app);
  
  // Filter communications to only include those with existing companies
  const filteredCommunications = communications.filter(comm => 
    companies.some(company => company.id === comm.companyId)
  );

  const overdueCommunications = getOverdueCommunications(filteredCommunications);
  const todayCommunications = getTodayCommunications(filteredCommunications);
  const notificationCount = overdueCommunications.length + todayCommunications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-lg border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex flex-shrink-0 items-center">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  CommTracker
                </span>
              </Link>
              <Navigation currentPath={location.pathname} />
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150"
              >
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;