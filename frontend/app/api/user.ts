import axios from 'axios';


class UserApi {
    url = process.env.API_URL;

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

    async searchUser(username: string) {
        const response = await axios.get(
            this.url + 'user-detail/' + username + '/'
        )
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
        return response;
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

    async updateProfile(infos: { username: string, first_name: string, last_name: string, foto_perfil?: File | null }, token: string) {
        const data = new FormData();
        data.append('username', infos.username);
        data.append('first_name', infos.first_name);
        data.append('last_name', infos.last_name);
        if (infos.foto_perfil) {
            data.append('foto_perfil', infos.foto_perfil);
        }
        const response = await axios.put(
            this.url + 'user-update/',
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    }
    async SearchUsers(username: string) {
        try {
            const response = await axios.get(this.url + 'user-detail/search/' + username + "/", {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        }
        catch (error) {
            throw error;
        }
    }
}


export default new UserApi();