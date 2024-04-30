import axios from 'axios';


class UserApi {
    url = 'http://localhost:8000/api/v1/';

    async login(infos: { username: string, password: string }) {
        const response = await axios.post(
            this.url + 'jwt/create/',
            infos
        )
        return response.data;
    }

    async register(infos: { username: string, password: string, email: string, first_name: string, last_name: string }) {
        const response = await axios.post(
            this.url + 'cadastrar/',
            infos
        )
        return response.data;
    }

    async getUser(token: string) {
        const response = await axios.get(
            this.url + 'user-detail/',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        return response.data;
    }

    async refreshToken(token: string) {
        const response = await axios.post(
            this.url + 'jwt/refresh/',
            { refresh: token }
        )
        return response.data;
    }

    async verifyToken(token: string) {
        const response = await axios.post(
            this.url + 'jwt/verify/',
            { token: token }
        )
        return response.data;
    }

    async recoverPassword(infos: { email: string }) {
        const response = await axios.post(
            this.url + 'users/reset_password/',
            infos
        )
        return response.data;
    }

    async changePassword(infos: { new_password: string, re_new_password: string, uid: string, token: string }) {
        const response = await axios.post(
            this.url + 'users/reset_password_confirm/',
            infos
        )
        return response.data;
    }
}


export default new UserApi();