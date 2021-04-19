const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require ("body-parser");
const app = express();
app.use(bodyParser.json());
// configuração do CORS para aceitar varios protocolos de requisição
const configCors = {
    origin:"*",
    optionsSuccessStatus:200
}
// configuração da comunicação com o banco de dados mangodb
const url = mongoose.connect("mongodb+srv://Demarrage:Alunos123@clustercliente.2ijmo.mongodb.net/lojadb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
// Construção da tabela produtos
const tbproduto = mongoose.Schema({
    nomeproduto:String,
    descricao:String,
    quantidade:Number,
    preco:String,
    foto:String
});
// construção do modelo da tabela no mongodb
const Produto = mongoose.model("produto", tbproduto);
// criação do endpoints para o modelo produto.
// Vamos iniciar com a rota para efetuar o cadastro dos produtos
// Esta rota recebe o verbo POST(postar os dados do produto)
app.post("/produto/cadastro",cors(configCors),(req,res)=>{
const dados = new Produto(req.body);
dados.save().then(()=>{
    res.status(201).send({rs:"Produto Cadastrado"})
}).catch((erro)=>console.error(`Erro ao tentar cadastrar ${erro}`));
});
app.put("/produto/atualizar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar atualizar ${erro}`});
            return;
        }
        res.status(200).send({rs:"Produto Atualizado."})
    })
});
app.delete("/produto/deletar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar deletar ${erro}`})
            return;
        }
        res.status(200).send({rs:"Produto deletado."})
    })
});
app.get("/produto/listar",cors(configCors),(req,res)=>{
    Produto.find((erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Ocorreu um erro ao tentar listar ${erro}`})
            return;
        }
        res.status(200).send({rs:dados});
    })
});
app.get("/produto/codproduto/:id",cors(configCors),(req,res)=>{
    Produto.findById(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(200).send({rs:`Ocorreu um erro ao tentar consultar produto ${erro}`})
            return;
        }
        res.status(200).send({res:dados})
    })
});
app.get("/produto/nomeproduto/:nome",cors(configCors),(req,res)=>{
    Produto.find({nomeproduto:req.params.nome},(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar consultar o produto ${erro}`})
            return;
        }
        res.status(200).send({rs:dados});   
    })
});

app.listen("2500", ()=>console.log("Servidor online na porta 2500"));