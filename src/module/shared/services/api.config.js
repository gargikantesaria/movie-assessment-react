export const config = {
    api: {
        baseUrl: 'https://movie-assessment-backend.vercel.app/v1',
    }
}

export class AUTHENTICATION {
    static get LOGIN_URL() {
        return config.api.baseUrl + '/auth/login';
    }
}

export class MOVIE {
    static get MOVIE_LIST_URL() {
        return config.api.baseUrl + '/movie';
    }

    static get CREATE_MOVIE_URL() {
        return config.api.baseUrl + '/movie';
    }

    static get GET_MOVIE_DETAILS() {
        return config.api.baseUrl + '/movie';
    }
}

