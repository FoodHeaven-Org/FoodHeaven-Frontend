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
        translations = {},
        id_tipo_comida = 0
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
        this.translations = translations
        this.id_tipo_comida = id_tipo_comida
    }

    getLocalized(locale) {
        const language = String(locale ?? 'es').split('-')[0]
        const translation = this.translations?.[language] ?? this.translations?.es

        return {
            ...this,
            nombre: translation?.nombre ?? this.nombre,
            complemento: translation?.complemento ?? this.complemento
        }
    }
}
