import React from 'react';
import { Mail, Phone, Plus, X } from 'lucide-react';
import { Company } from '../../types';

interface ContactListProps {
  type: 'email' | 'phone';
  contacts: string[];
  onChange: (contacts: string[]) => void;
}

export default function ContactList({ type, contacts, onChange }: ContactListProps) {
  const [newContact, setNewContact] = useState('');

  const handleAdd = () => {
    if (newContact && !contacts.includes(newContact)) {
      onChange([...contacts, newContact]);
      setNewContact('');
    }
  };

  const handleRemove = (contact: string) => {
    onChange(contacts.filter(c => c !== contact));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type={type === 'email' ? 'email' : 'tel'}
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          placeholder={`Add ${type}`}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-2">
              {type === 'email' ? (
                <Mail className="h-4 w-4 text-gray-400" />
              ) : (
                <Phone className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">{contact}</span>
            </div>
            <button
              onClick={() => handleRemove(contact)}
              className="p-1 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}