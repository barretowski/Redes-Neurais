import Neuronio from "./Neuronio.js";

const BIAS = 1

export default class RedeNeural {


    constructor(quantidadeEntradas, quantidadeCamadaInterna, quantidadeSaidas, funcaoSaida, taxaAprendizagem, limiteEpocas, limiteErro) 
    {
        const FUNCOES_SAIDA = [
            {
                funcao : this.funcaoLinear,
                derivada : this.funcaoLinearDx
            },
            {
                funcao : this.funcaoLogistica,
                derivada : this.funcaoLogisticaDx
            },
            {
                funcao : this.funcaoTangenteHiperbolica,
                derivada : this.funcaoTangenteHiperbolicaDx
            }
        ];

        this.matrizMaximoMinimo = [];
        
        this.quantidadeEntradas = quantidadeEntradas;
        this.quantidadeCamadaInterna = quantidadeCamadaInterna;
        this.quantidadeSaidas = quantidadeSaidas;
        this.taxaAprendizagem = taxaAprendizagem;
        this.limiteEpocas = limiteEpocas;
        this.limiteErro = limiteErro;
        this.timeLineExecucaoRede = [];
        this.erroRede = 0;
        this.epocas = 0;
        this.indiceFuncaoSaida = funcaoSaida;
        //provisorio
        this.funcaoSaida = FUNCOES_SAIDA[funcaoSaida].funcao;
        this.funcaoSaidaDx = FUNCOES_SAIDA[funcaoSaida].derivada;
        this.classes = [];

        this.inicializarRede();
    }

    inicializarRede() 
    {
        this.camadaEntrada = this.criarCamada(this.quantidadeEntradas + BIAS);
        this.camadaInterna = this.criarCamada(this.quantidadeCamadaInterna);
        this.camadaSaida = this.criarCamada(this.quantidadeSaidas + BIAS);

        this.ligacoesCamadaEntrada = this.criarLigacoes(this.camadaEntrada, this.camadaInterna);
        this.ligacoesCamadaSaida = this.criarLigacoes(this.camadaInterna, this.camadaSaida);
    }

    criarCamada(quantidadeNeuronios) 
    {
        let camada = [];

        for (let i = 0 ; i < quantidadeNeuronios ; i++) {
            camada.push(new Neuronio());
        }

        return camada;
    }

    criarLigacoes(camada1, camada2) 
    {
        let ligacoes = [];
        for (let i in camada1) {
            ligacoes[i] = [];
            for (let j in camada2) {
                ligacoes[i][j] = Math.random()* 2 * (Math.round(Math.random()) ? 1 : -1);
            }
        }
        return ligacoes;
    }
    
    prever(entradas) 
    {
        let saidas = [];
        entradas = this.normalizarEntradas(entradas);
        for (let i in entradas) {
            this.camadaEntrada[i].setEntrada(entradas[i]);
        }

        this.calcularSaidaCamada(this.camadaEntrada,this.camadaInterna, this.ligacoesCamadaEntrada);
        this.calcularSaidaCamada(this.camadaInterna,this.camadaSaida, this.ligacoesCamadaSaida);

        for(let neuronio of this.camadaSaida) {
            saidas.push(neuronio.getSaida());
        }

        return saidas;

    }

    calcularSaidaCamada(camadaEntrada, camadaSaida, ligacoes) 
    {
        let net = 0;
        for (let i in camadaSaida) {
            for(let j in camadaEntrada) {
                net += camadaEntrada[j].getEntrada() * ligacoes[j][i];
            }

            camadaSaida[i].setEntrada(net);
            camadaSaida[i].setSaida(this.funcaoSaida(net));
            net = 0;
        }
    }

    treinar(dados, classes)
    {
        this.criarMatrizMaximoMinimo(dados);
        this.classes = classes;
        let classe;
        let entradas;
        let saidaEsperada;
        this.epocas = 0;
        do {
            this.interacao = 0;
            this.errosEpoca = [];
            for (let dado of dados) {
                this.interacao++;
                classe = dado[dado.length - 1];
                entradas = dado.slice(0,-1);
                saidaEsperada = this.formatarSaidaEsperada(classe,classes);
                this.prever(entradas);
                this.calcularErroRede(saidaEsperada);
            }

            this.erroRede = this.errosEpoca.reduce((a, b) => a + b, 0) / this.errosEpoca.length;
            console.log("Epocas: ", this.epocas, "Erro: ",this.erroRede);

            this.timeLineExecucaoRede.push({
                erro : this.erroRede,
                epocas : this.epocas
            });
           
            this.epocas++;
        } while(this.erroRede >= this.limiteErro && this.epocas < this.limiteEpocas);


    }

    criarMatrizMaximoMinimo(dados) 
    {
        let colunaAtual = [];
        for (let i = 0; i < this.quantidadeEntradas ; i++) {
            colunaAtual = dados.map(linha => {
                return linha[i];
            });

            this.matrizMaximoMinimo.push({
                "minimo" : Math.min(...colunaAtual),
                "maximo" : Math.max(...colunaAtual)
            });
        }

    }

    normalizarEntradas(entradas) 
    {
        if(this.matrizMaximoMinimo.length ==0) {
            throw "Matriz de minimo e maximo Inessistente.";
        }

        for(let indice in entradas) {
            entradas[indice] = (entradas[indice] - this.matrizMaximoMinimo[indice]["minimo"]) / (this.matrizMaximoMinimo[indice]["maximo"] - this.matrizMaximoMinimo[indice]["minimo"]) ;
        }

        return entradas;
    }

    calcularErroRede(saidaEsperada) 
    {
        let erro;
        let somatorioErrosRede = 0;
        let neuronio
        for (let indice in this.camadaSaida) {
            neuronio = this.camadaSaida[indice];
            erro = (saidaEsperada[indice] - neuronio.getSaida());
            neuronio.setErro(erro  * this.funcaoSaidaDx(neuronio.getSaida()));
            somatorioErrosRede += Math.pow(erro,2); 
        }

        this.propagarErro(this.camadaSaida, this.camadaInterna, this.ligacoesCamadaSaida);
        this.propagarErro(this.camadaInterna, this.camadaEntrada, this.ligacoesCamadaEntrada);
      
        this.errosEpoca.push(somatorioErrosRede / 2);
    }

    propagarErro(camadaErro, camadaPropagar,ligacoes)
    {
        let erro = 0;
        let novoPeso;
        for (let i in camadaPropagar) {
            for(let j in camadaErro) {
                
                erro += camadaErro[j].getErro() * ligacoes[i][j];
                novoPeso = ligacoes[i][j] + this.taxaAprendizagem * camadaErro[j].getErro() *  camadaPropagar[i].getSaida();
                ligacoes[i][j] = novoPeso;
                
            }
            camadaPropagar[i].setErro(erro  * this.funcaoSaidaDx(camadaPropagar[i].getSaida()));
            erro = 0;
        }
    }

    formatarSaidaEsperada(saida,classes) 
    {
        let saidaFormatada = [];
        for(let classe in classes) {
            if(classe == saida) {
                saidaFormatada.push(1);
            } else if(this.funcaoSaida == this.funcaoTangenteHiperbolica) {
                saidaFormatada.push(-1);
            } else {
                saidaFormatada.push(0);
            }
        }
        for(let i = 0; i < BIAS ; i++) {
            if(this.funcaoSaida == this.funcaoTangenteHiperbolica) {
                saidaFormatada.push(-1);
            } else {
                saidaFormatada.push(0);
            }
        }

        return saidaFormatada;
    }

    matrizConfusao(teste, classes) 
    {
        let matriz = this.inicializarMatrizConfusao(classes);
        let classeDado;
        let entradas;
        let listaSaidasEsperadas = [];
        let listaResultado = [];
        let posicaoEsperada = 0;
        let posicaoResultado = 0;
        let saidaEsperada;
        let saidaResultado;

        for (let dado of teste) {
            classeDado = dado[dado.length - 1];
            entradas = dado.slice(0,-1);

            saidaEsperada = this.formatarSaidaEsperada(classeDado,classes);
            posicaoEsperada = Math.max(...saidaEsperada);
            posicaoEsperada = saidaEsperada.indexOf(posicaoEsperada);

            saidaResultado = this.prever(entradas);
            posicaoResultado = Math.max(...saidaResultado);
            posicaoResultado = saidaResultado.indexOf(posicaoResultado);

            listaSaidasEsperadas.push(posicaoEsperada)
            listaResultado.push(posicaoResultado);
        }

        for (let indice in listaSaidasEsperadas) {
            matriz[listaSaidasEsperadas[indice]][listaResultado[indice]] ++;
        }
       
        return matriz;
    }

    carregarDados(json) {
        delete json.camadaEntrada;
        delete json.camadaInterna;
        delete json.camadaSaida;
        Object.assign(this, json);
    }
   inicializarMatrizConfusao(classes) 
   {
        let matriz = [];
        for (let linha in [...classes.keys()]) {
            matriz[linha] = [];
            for (let coluna in [...classes.keys()]) {
                matriz[linha][coluna] = 0;
            }
        }
        return matriz;
   }

    funcaoLinear(net) 
    {
        return net/10;
    }

    funcaoLinearDx() 
    {
        return 1/10;
    }

    funcaoLogistica(net) 
    {
        return 1 / (1 + Math.exp(-1 * net));
    }

    funcaoLogisticaDx(net) 
    {
        return this.funcaoLogistica(net) * ( 1 - this.funcaoLogistica(net) );
    }

    funcaoTangenteHiperbolica(net)
    {
        return Math.tanh(net);
    }

    funcaoTangenteHiperbolicaDx(net)
    {
        return 1 - Math.pow(this.funcaoTangenteHiperbolica(net),2);
    }
}