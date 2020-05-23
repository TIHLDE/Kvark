import API from '../api';

class NotificationService {

    static updateNotificationReadState = async (id, newState, callback = null) => {
      const response = API.updateNotification(id, {read: newState}).response();
      return response.then((data) => {
        !callback || callback(response.isError === true, data);
        return data;
      });
    }

}

export default NotificationService;
