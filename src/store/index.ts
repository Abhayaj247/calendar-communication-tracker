import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appSlice from './appSlice';
import reportingReducer from './reportingSlice';
import { 
  updateCommunicationMethodFrequency, 
  updateEngagementEffectiveness,
  updateCommunicationTrends,
  resetReportingMetrics
} from './reportingSlice';
import { DEFAULT_COMMUNICATION_METHODS } from '../types';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['app', 'reporting'] // only app and reporting will be persisted
};

const rootReducer = combineReducers({
  app: appSlice.reducer,
  reporting: reportingReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// Initialize reporting metrics when the store is created
const initializeReportingMetrics = () => {
  // Reset existing metrics
  store.dispatch(resetReportingMetrics());

  // Populate default communication methods
  DEFAULT_COMMUNICATION_METHODS.forEach(method => {
    // Set initial frequency to 0
    store.dispatch(updateCommunicationMethodFrequency(method.id));
    
    // Set initial engagement effectiveness to 50
    store.dispatch(updateEngagementEffectiveness({
      methodId: method.id,
      isSuccessful: true // Neutral starting point
    }));
  });
};

// Call initialization
initializeReportingMetrics();

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './appSlice';
export * from './reportingSlice';