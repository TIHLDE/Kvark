import { useCallback } from 'react';
import API from 'api/api';

export const useNotification = () => {
  const updateNotificationReadState = useCallback(async (id: number, newReadState: boolean) => {
    return API.updateNotification(id, { read: newReadState }).then((response) => {
      return !response.isError ? Promise.resolve(response.data) : Promise.reject(response.data);
    });
  }, []);

  return { updateNotificationReadState };
};
