import API from '../api';
import store from '../../store/store';

class MiscService {

    // Fetch warnings
    static getWarning = async (callback = null) => {
        const response = API.getWarning().response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }

    // Send mail to TIHLDE
    static postEmail = async (data, callback = null) => {
        const response = API.emailForm(data).response();
        return response.then((data) => {
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default MiscService;