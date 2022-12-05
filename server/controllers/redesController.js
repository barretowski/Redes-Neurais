import csvToJson from "convert-csv-to-json";
import filePath from "path";
import fs from "fs";
import { readFile } from 'node:fs/promises'

import RedeNeural from "../core/RedeNeural.js";
import ProcessaArquivo from "../core/ProcessaArquivo.js";

export default class controller
{
    async convertFileToJson(file){
        var dir = filePath.dirname('uploads/'+file);
        //var dir = filePath.dirname('C:/Users/Phenr/OneDrive/Documentos/Projetos/redesNeurais/redes-neurais/server/uploads/'+file);
        let fileInputName = dir+"/"+file;
        let fileOutputName = './uploads/fileJson.json';
        csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

    };

    async readJsonFile(req, res)
    {
        try {
          var dir = filePath.dirname('uploads/fileJson.json');
          //var dir = filePath.dirname('C:/Users/Phenr/OneDrive/Documentos/Projetos/redesNeurais/redes-neurais/server/uploads/'+file);
          const contents = await readFile(dir+"/fileJson.json", { encoding: 'utf8' });
          return contents;
        } catch (error) {
          return null;
        }
    };

    async sendTreino(req, res)
    {
      let dados = req.body;
      let treino = ProcessaArquivo.arquivoParaObjeto("uploads/"+dados['arquivoTreino']);

      let classes = ProcessaArquivo.obterClasses(treino);
      treino.dados = ProcessaArquivo.sanitizarDados(treino.dados, classes);

      let mapingFuncoes = {
        'Linear' : 0, 
        'Logística' : 1, 
        'Hiperbólica' : 2
      };

      let quantidadeEntradas = treino.cabecalho.length - 1;
      let quantidadeCamadaInterna = parseInt(dados['camadaOculta']);
      let quantidadeSaidas = classes.length;
      let funcaoSaida = mapingFuncoes[dados['funcaoTransf']];
      let taxaAprendizagem = parseFloat(dados['txAprendizagem']); 
      let limiteEpocas = parseFloat(dados['nrInteracoes']);
      let limiteErro = parseFloat(dados['valorErro']);

      let rede = new RedeNeural(
        quantidadeEntradas, 
        quantidadeCamadaInterna, 
        quantidadeSaidas, 
        funcaoSaida, 
        taxaAprendizagem, 
        limiteEpocas, 
        limiteErro
      );

      rede.treinar(treino.dados, classes);

      fs.writeFileSync("uploads/treino.json",JSON.stringify(rede));

      res.json(rede.timeLineExecucaoRede);
    }

    async sendTeste (req, res) {
      let nomeArquivo = req.files[0].filename;

      let json = fs.readFileSync("uploads/treino.json");
      let objetoRede = JSON.parse(json);

      let teste = ProcessaArquivo.arquivoParaObjeto("uploads/" + nomeArquivo);
      teste.dados = ProcessaArquivo.sanitizarDados(teste.dados, objetoRede.classes);
  
      let rede = new RedeNeural(
        objetoRede.quantidadeEntradas, 
        objetoRede.quantidadeCamadaInterna, 
        objetoRede.quantidadeSaidas, 
        objetoRede.indiceFuncaoSaida, 
        objetoRede.taxaAprendizagem, 
        objetoRede.limiteEpocas, 
        objetoRede.limiteErro
      );
      rede.carregarDados(objetoRede);
      let matriz = rede.matrizConfusao(teste.dados, rede.classes);

      res.json({
        classes: rede.classes,
        matriz: matriz
      });
    }
}