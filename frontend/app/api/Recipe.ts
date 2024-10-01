import axios from 'axios';


class RUAPI {
    alimentos = process.env.API_URL + "alimentos/"
    cardapio = process.env.API_URL + "cardapios/"
    async getAlimento(id: Number) {

        const response = await axios.get(this.alimentos + id + "/")

        return response.data

    }

    async getAlimentos() {

        const response = await axios.get(this.alimentos)

        return response.data

    }

    async postAlimento(token: string, data: any) {

        const response = await axios.post(this.alimentos, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data

    }

    async deleteAlimento(token: string, id: Number) {

        const response = await axios.delete(this.alimentos + id + "/", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data

    }

    async getCardapio() {

        const response = await axios.get(this.cardapio)
        return response.data

    }

    async getCardapioByDate(token: string, date: string) {

        const response = await axios.get(this.cardapio,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        return response.data;

    }

    async postCardapio(token: string, data: any) {

        const response = await axios.post(this.cardapio, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data

    }

    async updateCardapio(token: string, id: Number | undefined, data: any) {
        const response = await axios.put(this.cardapio + id + "/", data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data

    }
}

export default new RUAPI();