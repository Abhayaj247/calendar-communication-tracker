import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Company, Communication, DEFAULT_COMMUNICATION_METHODS } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  updateCommunicationMethodFrequency, 
  updateEngagementEffectiveness,
  updateCommunicationTrends 
} from './reportingSlice';

interface AppState {
  companies: Company[];
  communications: Communication[];
  communicationMethods: typeof DEFAULT_COMMUNICATION_METHODS;
}

const initialState: AppState = {
  companies: [],
  communications: [],
  communicationMethods: DEFAULT_COMMUNICATION_METHODS
};

// Remove the store creation from here
// We'll create the store in index.ts to avoid circular dependencies

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addCompany: (state, action: PayloadAction<Company>) => {
      // Ensure the company has an ID
      const companyToAdd = {
        ...action.payload,
        id: action.payload.id || uuidv4()
      };

      // Check if company already exists
      const existingIndex = state.companies.findIndex(
        company => company.id === companyToAdd.id
      );

      if (existingIndex === -1) {
        // Add new company
        state.companies.push(companyToAdd);
      } else {
        // Update existing company
        state.companies[existingIndex] = companyToAdd;
      }
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex(
        company => company.id === action.payload.id
      );

      if (index !== -1) {
        state.companies[index] = {
          ...action.payload,
          // Ensure ID is preserved
          id: action.payload.id
        };
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      // Remove the company
      state.companies = state.companies.filter(
        company => company.id !== action.payload
      );
      
      // Remove communications associated with the deleted company
      state.communications = state.communications.filter(
        comm => comm.companyId !== action.payload
      );
    },
    addCommunication: (state, action: PayloadAction<Communication>) => {
      // Ensure the communication has an ID
      const communicationToAdd = {
        ...action.payload,
        id: action.payload.id || uuidv4()
      };

      // Check if communication already exists
      const existingIndex = state.communications.findIndex(
        comm => comm.id === communicationToAdd.id
      );

      if (existingIndex === -1) {
        // Add new communication
        state.communications.push(communicationToAdd);
      } else {
        // Update existing communication
        state.communications[existingIndex] = communicationToAdd;
      }

      return state;
    },
    updateCommunication: (state, action: PayloadAction<Communication>) => {
      const index = state.communications.findIndex(
        comm => comm.id === action.payload.id
      );

      if (index !== -1) {
        state.communications[index] = {
          ...action.payload,
          // Ensure ID is preserved
          id: action.payload.id
        };
      }
    },
    deleteCommunication: (state, action: PayloadAction<string>) => {
      state.communications = state.communications.filter(
        comm => comm.id !== action.payload
      );
    },
    completeCommunication: (state, action: PayloadAction<string>) => {
      const index = state.communications.findIndex(
        comm => comm.id === action.payload
      );

      if (index !== -1) {
        // Mark the communication as completed
        const completedCommunication = {
          ...state.communications[index],
          completed: true
        };
        
        state.communications[index] = completedCommunication;
      }

      return state;
    },
    bulkCompleteCommunications: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(commId => {
        const index = state.communications.findIndex(
          comm => comm.id === commId
        );

        if (index !== -1) {
          // Mark the communication as completed
          const completedCommunication = {
            ...state.communications[index],
            completed: true
          };
          
          state.communications[index] = completedCommunication;
        }
      });

      return state;
    },
    // Optional: Reset entire app state
    resetAppState: () => initialState
  }
});

// Selectors
export const selectCommunications = (state: any) => state.app.communications;
export const selectCompanies = (state: any) => state.app.companies;

export const selectCommunicationsByMethod = createSelector(
  [selectCommunications],
  (communications) => {
    return communications.reduce((acc: Record<string, number>, comm) => {
      acc[comm.methodId] = (acc[comm.methodId] || 0) + 1;
      return acc;
    }, {});
  }
);

export const { 
  addCompany, 
  updateCompany, 
  deleteCompany,
  addCommunication,
  updateCommunication,
  deleteCommunication,
  completeCommunication,
  bulkCompleteCommunications,
  resetAppState
} = appSlice.actions;

export default appSlice;