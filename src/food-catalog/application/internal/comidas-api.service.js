import axios from "axios";

//const recetaApi = import.meta.env.VITE_NEWS_API_URL;
//const headLines = import.meta.env.VITE_TOP_ARTICLE_ENDPOINT_PATH;
//const key = import.meta.env.VITE_NEWS_API_KEY

// ${newApi}/${headLines}
export class ComidasApiService {
    async getArticles() {
        var response = await axios.get(`https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=1`)
        return response;
    }
    async getArticles2() {
        var response = await axios.get(`https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=2`)
        return response;
    }
    async getArticles3() {
        var response = await axios.get(`https://6824f9c70f0188d7e72b99b7.mockapi.io/comida?id_tipo_comida=3`)
        return response;
    }
}