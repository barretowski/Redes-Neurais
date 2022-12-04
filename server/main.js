import express from "express";
import redesController from "./controllers/redesController.js";
import cors from "cors";
import multer from "multer";
import Controller from "./controllers/redesController.js";
import filePath from "path";
import fs from "fs";

const app = express();
const controller = new Controller();
app.use(express.json());
app.use(cors());

var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            cb( null, file.originalname);
        }
    }
);
var upload = multer( { storage: storage } );


app.post('/uploadFile', upload.array('file'), async (req, res) => {
    controller.convertFileToJson(req.files[0].filename);
    res.send({ upload: true, files: req.files });
});
app.get('/getJson', async (req,res) =>{
    await controller.readJsonFile().then(
        resp =>{
            return res.json(resp);
        }
    ).catch(
       err=>{
        console.log(err);
       }
    );
    
})

app.get("/",()=>{
    
})
// executando o servidor
app.listen(8081, ()=> {
    console.log("Servidor na porta 8081");
});

