import API from '../api';
import store from '../../store/store';
import * as MiscActions from '../../store/actions/MiscActions';

class MiscService {
  // Fetch warnings
  static getWarning = async (callback = null) => {
    const response = API.getWarning().response();
    return response.then((data) => {
      !callback || callback(response.isError === true, data);
      return data;
    });
  };

  // Send mail to TIHLDE
  static postEmail = async (data, callback = null) => {
    const response = API.emailForm(data).response();
    return response.then((data) => {
      !callback || callback(response.isError === true, data);
      return data;
    });
  };

  static setLogInRedirectURL = (redirectURL) => {
    MiscActions.setLogInRedirectURL(redirectURL)(store.dispatch);
  };

  static getLogInRedirectURL = () => {
    return MiscActions.getLogInRedirectURL(store.getState());
  };
}

export default MiscService;
