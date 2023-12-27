import axios from "axios";
import { config } from "./api.config";

export class ApiService {
    url = config.api.baseUrl;

    // post request to craete a new request
    post(url, data) {
        if (url.includes('download-quote')) {
            return axios.post(url, data, { responseType: 'blob' });
        } else {
            return axios.post(url, data);
        }
    }

    // put request to update whole data the data
    put(url, data) {
        return axios.put(url, data);
    }

    // get request to get data
    get(url, params) {
        return axios.get(url, { params });
    }

    // delete request to delete data
    delete(url) {
        return axios.delete(url);
    }
}