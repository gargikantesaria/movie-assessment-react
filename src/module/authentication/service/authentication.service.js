import { AUTHENTICATION } from "../../shared/services/api.config";
import { ApiService } from '../../shared/services/api.service';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export class AuthenticationService {

    apiService = new ApiService();
    // for login
    async logIn(userData) {
        return await this.apiService.post(AUTHENTICATION.LOGIN_URL, userData).then(response => {
            if (response.status === 200) {
                return response;
            } else {
                toast.error(response.response.data.errors[0].message, { autoClose: 4000 });
            }
            return response;
        }).catch(error => {
            toast.error(error.response.data.errors[0].message, { autoClose: 4000 });
            return error;
        });
    }
}