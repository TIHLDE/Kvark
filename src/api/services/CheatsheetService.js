import API from '../api';
import AuthService from '../../api/services/AuthService';

class CheatsheetService {
  static getCheatsheets = async (filters = null, study, grade) => {
    // Fetch cheatsheet
    if (AuthService.isAuthenticated()) {
      return API.getCheatsheets(filters, study, grade)
        .response()
        .then((data) => {
          return data;
        });
    }
  };
}
export default CheatsheetService;
