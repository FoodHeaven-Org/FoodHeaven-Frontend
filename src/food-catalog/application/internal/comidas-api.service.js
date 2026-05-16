import axios from 'axios'

export class ComidasApiService {
    async getBreakfastMeals() {
        return axios.get('https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=1')
    }

    async getLunchMeals() {
        return axios.get('https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=2')
    }

    async getDinnerMeals() {
        return axios.get('https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=3')
    }
}