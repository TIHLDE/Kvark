import { useCallback } from 'react';
import API from 'api/api';

export const useNotification = () => {
  const updateNotificationReadState = useCallback(async (id: number, newReadState: boolean) => API.updateNotification(id, { read: newReadState }), []);
  return { updateNotificationReadState };
};
