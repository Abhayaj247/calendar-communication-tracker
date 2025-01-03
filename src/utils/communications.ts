import { addDays, isAfter, isBefore, isToday, parseISO } from 'date-fns';
import { Communication } from '../types';

export const getOverdueCommunications = (communications: Communication[]) => {
  const currentTime = new Date();
  return communications.filter(
    (comm) => !comm.completed && isBefore(parseISO(comm.date), currentTime)
  );
};

export const getTodayCommunications = (communications: Communication[]) => {
  const currentTime = new Date();
  return communications.filter(
    (comm) => !comm.completed && isToday(parseISO(comm.date), { referenceDate: currentTime })
  );
};

export const getUpcomingCommunications = (communications: Communication[]) => {
  const currentTime = new Date();
  const nextWeek = addDays(currentTime, 7);
  return communications.filter(
    (comm) =>
      !comm.completed &&
      isAfter(parseISO(comm.date), currentTime) &&
      isBefore(parseISO(comm.date), nextWeek)
  );
};