export default class Neuronio { 

    constructor () {
        this.saida = 0;
        this.entrada = 1;
        this.erro = 0;
    }

    getSaida(){ return this.saida }
    setSaida(saida) { this.saida = saida }

    getEntrada() { return this.entrada }
    setEntrada(entrada) { this.entrada = entrada }

    getErro() { return this.erro }
    setErro(erro) { this.erro = erro }
}