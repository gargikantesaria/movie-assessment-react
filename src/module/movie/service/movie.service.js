import { AUTHENTICATION, MOVIE } from "../../shared/services/api.config";
import { ApiService } from '../../shared/services/api.service';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export class MovieService {

    apiService = new ApiService();

    // get movie list
    getMovieList(){
        return this.apiService.get(MOVIE.MOVIE_LIST_URL).then(response => {
            if (response.status === 200) {
                return response;
            }
            return response;
        }).catch(error => {
            return error;
        });
    }

    // add movie
    addMovie(movie) {
        return this.apiService.post(MOVIE.CREATE_MOVIE_URL, movie).then(response => {
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

    // update movie
    updateMovie(movie_uuid, movie){
        return this.apiService.put(`${MOVIE.CREATE_MOVIE_URL}/${movie_uuid}`, movie).then(response => {
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

    // get movie detail
    getMovieDetail(uuid) {
        return this.apiService.get(`${MOVIE.GET_MOVIE_DETAILS}/${uuid}`).then(response => {
            if (response.status === 200) {
                return response;
            }
            return response;
        }).catch(error => {
            return error;
        });
    }
    
}