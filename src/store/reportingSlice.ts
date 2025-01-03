import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Communication, DEFAULT_COMMUNICATION_METHODS } from '../types';

// Hardcoded current time for consistent real data reporting
const CURRENT_TIME = new Date('2025-01-03T19:49:11+05:30');

interface ReportingState {
  communicationMethodFrequency: Record<string, number>;
  engagementEffectiveness: Record<string, number>;
  communicationTrends: {
    total: number;
    overdue: number;
    completed: number;
  };
}

const initialState: ReportingState = {
  communicationMethodFrequency: Object.fromEntries(
    DEFAULT_COMMUNICATION_METHODS.map(method => [method.id, 0])
  ),
  engagementEffectiveness: Object.fromEntries(
    DEFAULT_COMMUNICATION_METHODS.map(method => [method.id, 50])
  ),
  communicationTrends: {
    total: 0,
    overdue: 0,
    completed: 0
  }
};

const reportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    // Reset metrics before adding new data
    resetReportingMetrics: (state) => {
      state.communicationMethodFrequency = Object.fromEntries(
        DEFAULT_COMMUNICATION_METHODS.map(method => [method.id, 0])
      );
      state.engagementEffectiveness = Object.fromEntries(
        DEFAULT_COMMUNICATION_METHODS.map(method => [method.id, 50])
      );
      state.communicationTrends = {
        total: 0,
        overdue: 0,
        completed: 0
      };
    },
    
    // Track communication method frequency
    updateCommunicationMethodFrequency: (state, action: PayloadAction<string>) => {
      const methodId = action.payload;
      state.communicationMethodFrequency[methodId] = 
        (state.communicationMethodFrequency[methodId] || 0) + 1;
    },
    
    // Track engagement effectiveness
    updateEngagementEffectiveness: (state, action: PayloadAction<{methodId: string, isSuccessful: boolean}>) => {
      const { methodId, isSuccessful } = action.payload;
      
      // Increment effectiveness score
      state.engagementEffectiveness[methodId] = Math.max(0, 
        Math.min(100, (state.engagementEffectiveness[methodId] || 50) + (isSuccessful ? 10 : -5))
      );
    },
    
    // Update communication trends
    updateCommunicationTrends: (state, action: PayloadAction<Communication>) => {
      const communication = action.payload;
      
      // Always increment total communications
      state.communicationTrends.total++;
      
      // Check for overdue communications
      const commDate = new Date(communication.date);
      if (commDate < CURRENT_TIME && !communication.completed) {
        state.communicationTrends.overdue++;
      }
      
      // Check for completed communications
      if (communication.completed) {
        state.communicationTrends.completed++;
      }
    }
  }
});

export const { 
  resetReportingMetrics,
  updateCommunicationMethodFrequency, 
  updateEngagementEffectiveness,
  updateCommunicationTrends
} = reportingSlice.actions;

export default reportingSlice.reducer;