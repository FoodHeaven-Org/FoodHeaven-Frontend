export class Comida {
    constructor({nombre = '', complemento = '', url = '',
                    id_comida = 0, nutriente = 0,
                    prote = 0, carbo = 0, grasa = 0}) {
        this.nombre = nombre;
        this.url = url;
        this.id_comida = id_comida;
        this.nutriente = nutriente?.cal;
        this.prote = nutriente?.prote;
        this.carbo = nutriente?.carbo;
        this.grasa = nutriente?.grasa;
        this.complemento = complemento;
    }
}