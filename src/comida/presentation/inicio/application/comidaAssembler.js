import {Comida} from "@/comida/presentation/inicio/domain/comida.entity.js"

export class ComidaAssembler {

    static toEntitiesFromResponse(response) {
        console.log(response)
        if (response.status !== 200) {
            console.error(`${response.status},  ${response.code}, ${response.message}`);
            return [];
        }
        const comidaResponse = response.data;
        return comidaResponse.map((comida) => {
            return this.toEntityFromResource(comida);
        });
    }

    static toEntityFromResource(resource) {
        let comida = new Comida(resource);
        return comida;
    }
}