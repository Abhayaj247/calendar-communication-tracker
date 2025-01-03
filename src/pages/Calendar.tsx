import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { completeCommunication } from '../store/appSlice';
import { PhoneCall, MessageCircle, Mail, Link, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

// Mapping of communication method icons
const COMMUNICATION_METHOD_ICONS = {
  'linkedin-post': Link,
  'linkedin-message': MessageCircle,
  'email': Mail,
  'phone-call': PhoneCall,
  'other': MoreHorizontal
};

export default function Calendar() {
  const dispatch = useDispatch();
  const { communications, companies, communicationMethods } = useSelector((state: RootState) => state.app);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Filter communications to only include those with existing companies
  const filteredCommunications = communications.filter(comm => 
    companies.some(company => company.id === comm.companyId)
  );

  const events = filteredCommunications.map((comm) => {
    const company = companies.find((c) => c.id === comm.companyId);
    const method = communicationMethods.find((m) => m.id === comm.methodId);
    const MethodIcon = COMMUNICATION_METHOD_ICONS[comm.methodId as keyof typeof COMMUNICATION_METHOD_ICONS] || MoreHorizontal;
    
    return {
      id: comm.id,
      title: `${company?.name} - ${method?.name}`,
      date: comm.date,
      backgroundColor: comm.completed ? '#10B981' : '#3B82F6',
      borderColor: comm.completed ? '#059669' : '#2563EB',
      extendedProps: {
        ...comm,
        companyName: company?.name,
        methodName: method?.name,
        MethodIcon
      }
    };
  });

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  const handleCompleteCommunication = () => {
    if (selectedEvent) {
      dispatch(completeCommunication(selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Communication Calendar</h1>
        <p className="mt-2 text-sm text-gray-700">
          View and manage your communication schedule
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow flex">
        <div className="w-3/4 pr-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            height="auto"
            eventClick={handleEventClick}
          />
        </div>
        
        {selectedEvent && (
          <div className="w-1/4 border-l pl-6">
            <h3 className="text-lg font-semibold mb-4">Communication Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <selectedEvent.extendedProps.MethodIcon className="mr-2 text-gray-600" />
                <span>{selectedEvent.extendedProps.methodName}</span>
              </div>
              <div>
                <strong>Company:</strong> {selectedEvent.extendedProps.companyName}
              </div>
              <div>
                <strong>Date:</strong> {format(new Date(selectedEvent.startStr), 'MMMM d, yyyy')}
              </div>
              {selectedEvent.extendedProps.notes && (
                <div>
                  <strong>Notes:</strong> {selectedEvent.extendedProps.notes}
                </div>
              )}
              {!selectedEvent.extendedProps.completed && (
                <button 
                  onClick={handleCompleteCommunication}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}