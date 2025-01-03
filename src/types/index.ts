export interface Company {
  id: string;
  name: string;
  location: string;
  linkedinProfile?: string;
  emails: string[];
  phoneNumbers: string[];
  comments?: string;
  communicationPeriodicity: number; // in weeks
}

export interface CommunicationMethod {
  id: string;
  name: string;
  description: string;
  sequence: number;
  isMandatory: boolean;
}

export interface Communication {
  id: string;
  companyId: string;
  companyName: string;
  methodId: string;
  methodName: string;
  date: string;
  notes?: string;
  completed: boolean;
}

export const DEFAULT_COMMUNICATION_METHODS: CommunicationMethod[] = [
  { 
    id: 'linkedin-post', 
    name: 'LinkedIn Post', 
    description: 'Post on company LinkedIn page', 
    sequence: 1, 
    isMandatory: false 
  },
  { 
    id: 'linkedin-message', 
    name: 'LinkedIn Message', 
    description: 'Direct message on LinkedIn', 
    sequence: 2, 
    isMandatory: false 
  },
  { 
    id: 'email', 
    name: 'Email', 
    description: 'Send an email', 
    sequence: 3, 
    isMandatory: true 
  },
  { 
    id: 'phone-call', 
    name: 'Phone Call', 
    description: 'Direct phone conversation', 
    sequence: 4, 
    isMandatory: false 
  },
  { 
    id: 'other', 
    name: 'Other', 
    description: 'Other communication method', 
    sequence: 5, 
    isMandatory: false 
  }
];