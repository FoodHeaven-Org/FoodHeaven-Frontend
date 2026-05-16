export class Comida {
    constructor({
        nombre = '',
        complemento = '',
        url = '',
        id_comida = 0,
        nutriente = {},
        prote = 0,
        carbo = 0,
        grasa = 0,
        id_tipo_comida = 0,
        es_especial = 0
    }) {
        this.id = id_comida
        this.id_comida = id_comida
        this.nombre = nombre
        this.url = url
        this.nutriente = nutriente?.cal ?? 0
        this.prote = nutriente?.prote ?? prote
        this.carbo = nutriente?.carbo ?? carbo
        this.grasa = nutriente?.grasa ?? grasa
        this.complemento = complemento
        this.id_tipo_comida = id_tipo_comida
        this.es_especial = es_especial
    }
}
