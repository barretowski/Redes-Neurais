import fs from "fs";

export default class ProcessaArquivo {

    static arquivoParaObjeto(dir, colunasSelecionadas) {
        let arquivo = fs.readFileSync(dir, "utf8");

        arquivo = arquivo.split(/\r?\n|\r|\n/g);
        
        for (let linha in arquivo) {
            arquivo[linha] = arquivo[linha].split(',');
        }        
        let cabecalho = arquivo.shift();
        let linhaArquivo = [];
        if (colunasSelecionadas.length > 0) {
            for (let linha in arquivo) {
                for(let coluna in arquivo[linha]) {
                    if (colunasSelecionadas.indexOf(cabecalho[coluna]) !== -1  || coluna == cabecalho.length -1) {
                        linhaArquivo.push(arquivo[linha][coluna]);
                    }
                }
                arquivo[linha] = linhaArquivo;
                linhaArquivo = [];
    
            }
    
            cabecalho = cabecalho.filter(( coluna, indice ) => {
                return indice == cabecalho.length -1 || colunasSelecionadas.indexOf(coluna) != -1;
            });
        }
        return {
            cabecalho : cabecalho,
            dados : arquivo
        };
    }

    static obterClasses(arquivo) {
        let arrayAuxiliar = [];

        for (let linha of arquivo.dados) {
            if (linha[linha.length - 1] !== '') {
                arrayAuxiliar[linha[linha.length - 1]] = 1;
            }
        }
        let classes = [];

        for (let classe in arrayAuxiliar) {
            classes.push(classe);
        }
        return classes;
    }

    static sanitizarDados(arquivo, classes) {
        let arquivoSanitizado = arquivo.filter((linha) => {
            if (linha[linha.length - 1] == '') {
                return false;
            }                
            return true;
        })
        let medias = [];
        arquivoSanitizado.map(linha => {
           
            for(let coluna in linha) {
               if (coluna != linha.length - 1) {
                    if( medias[coluna] == undefined) {
                        medias[coluna] = parseFloat(linha[coluna]);
                    } else {
                        medias[coluna] += parseFloat(linha[coluna]);
                    }
               }
            }
        });

        medias = medias.map(coluna => {
            return Math.round(coluna / arquivoSanitizado.length);
        })
        arquivoSanitizado = arquivoSanitizado.map(linha => {
            let quantidadeColunas = linha.length - 1;
            let classe = linha.pop();
            for (let coluna in linha) {
                if ( linha[coluna] === '') {
                    linha[coluna] = medias[coluna];
                }
                linha[coluna] = parseFloat(linha[coluna]);
            }
            linha.push(classe);
            linha[quantidadeColunas] =  parseInt(classes.indexOf(linha[quantidadeColunas]));
            return linha;
          
        });
        return arquivoSanitizado;
    }
    

}