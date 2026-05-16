import { Comida } from '@/food-catalog/domain/model/entities/comida.entity.js'

export function toComidaEntitiesFromResponse(response) {
    if (response.status !== 200) {
        console.error(`${response.status}, ${response.code}, ${response.message}`)
        return []
    }

    return response.data.map(toComidaEntityFromResource)
}

function toComidaEntityFromResource(resource) {
    return new Comida(resource)
}