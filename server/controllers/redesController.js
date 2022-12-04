import csvToJson from "convert-csv-to-json";
import filePath from "path";
import fs from "fs";
import { readFile } from 'node:fs/promises'

export default class controller
{
    async convertFileToJson(file){
        var dir = filePath.dirname('C:/Users/flavi/Documents/redes-neurais/server/uploads/'+file);
        //var dir = filePath.dirname('C:/Users/Phenr/OneDrive/Documentos/Projetos/redesNeurais/redes-neurais/server/uploads/'+file);
        let fileInputName = dir+"/"+file;
        let fileOutputName = './uploads/fileJson.json';
        csvToJson.generateJsonFileFromCsv(fileInputName,fileOutputName);

    };
    async sendTreino(req, res)
    {
      console.log(req.body);
    }
    async readJsonFile(req, res)
    {
        try {
          var dir = filePath.dirname('C:/Users/flavi/Documents/redes-neurais/server/uploads/fileJson.json');
          //var dir = filePath.dirname('C:/Users/Phenr/OneDrive/Documentos/Projetos/redesNeurais/redes-neurais/server/uploads/'+file);
          const contents = await readFile(dir+"/fileJson.json", { encoding: 'utf8' });
          return contents;
        } catch (error) {
          return null;
        }
    };
}