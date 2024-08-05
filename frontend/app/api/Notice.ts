import axios from "axios";



interface Comentario {
    id: number;
    post_comentario: number;
    autor_comentario: number;
    autor_comentario_nome: string;
    imagem_autor_comentario: string;
    conteudo_comentario: string;
    criacao: string;
}

interface Comentarios {
    data: {
        count: number;
        next: string;
        previous: string;
        results: Comentario[];
    }
}

interface Favorito {
    count: number;
    next: string;
    previous: string;
    data: {
        results: [
            {
                id: number;
                post_favorito: number;
                autor_favorito: number;
            }
        ]
    }

}

class NoticeAPI {
    url = process.env.API_URLv2 + 'posts/';
    favorite_url = process.env.API_URLv2 + 'favoritos/';

    async ListPost() {
        const response = await axios.get(this.url)
        return response.data;
    }
    async ListNextPosts(next: string) {
        const response = await axios.get(next)
        return response.data;
    }

    async GetPost(post_id: number) {
        const response = await axios.get(this.url + post_id + "/")
        return response.data
    }

    async CreatePost(token: string, data: { imagem_post: File, titulo_post: string, conteudo_post: string }) {
        const response = await axios.post(this.url,
            data
            ,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token
                }
            })
        return response.data
    }

    async searchPostsByUser(username: string) {
        const response = await axios.get(this.url + "search/" + username + "/")
        return response.data;
    }

    async ListComments(post_id: number) {
        const response: Comentarios = await axios.get(this.url + post_id + "/comentarios/")
        return response.data

    }

    async ListNextComments(next: string) {
        try {
            const response = await axios.get(next)
            return response.data
        } catch (error) {
            throw error
        }
    }

    async CreateComment(token: string, data: { post_comentario: number, conteudo_comentario: string, autor_comentario: number }) {
        try {
            const response = await axios.post(
                this.url + data.post_comentario + "/comentarios/",
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            return response.data.comentario;
        } catch (error) {
            throw error
        }
    }

    async DeleteComment(token: string, data: { post_comentario: number, id: number }) {
        try {
            const response = await axios.delete(
                this.url + data.post_comentario + "/comentarios/" + data.id + "/",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

    async ListFavoritePosts(token: string) {
        try {
            const response = await axios.get(
                this.favorite_url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

    async ListNextFavoritePosts(token: string, next: string) {
        const response = await axios.get(
            next,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
        );
        return response.data
    }

    async ListPostsByUser(username: string) {
        try {
            const response = await axios.get(
                this.url + "search/" + username + "/",
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

    async ListNextPostsByUser(next: string) {
        try {
            const response = await axios.get(
                next,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

    async CreateFavoritePosts(token: string, post_id: number) {
        try {
            const response = await axios.post(
                this.favorite_url + post_id + "/",
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

    async DeleteFavoritePosts(token: string, post_id: number) {
        try {
            const response = await axios.delete(
                this.favorite_url + "delete/" + post_id + "/",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            return response.data
        } catch (error) {
            throw error
        }
    }

}

export default new NoticeAPI();