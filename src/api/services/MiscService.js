import API from '../api';
import store from '../../store/store';
import * as GridActions from '../../store/actions/GridActions';

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

    static getGridData = async (callback = null) => {
        const response = API.getGridItems().response();
        return response.then((data) => {
            if(response.isError === false) {
                // Store grid data in store
                GridActions.setGridItems(data)(store.dispatch);
            }
            !callback || callback(response.isError === true, data);
            return data;
        });
    }
}

export default MiscService;