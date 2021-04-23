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
// construção da estrutura da tabela carrinho
const tbcarrinho = mongoose.Schema({
    idproduto:String,
    nomeproduto:String,
    preco:String,
    foto:String
});
// criação da tabela carrinho
const Carrinho = mongoose.model("carrinho", tbcarrinho);
// Construção da estrutura da tebela usuario
const tbusuario = mongoose.Schema({
    nomeusuario:String,
    senha:String,
    nomecompleto:String,
    email:String
});
// criação do modelo de dado,ou seja a criação da tabela efetivamente.
const Usuario = mongoose.model("usuario", tbusuario);
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
            res.status(400).send({rs:`Ocorreu um erro ao tentar consultar produto ${erro}`})
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

// ---------- Criação das rotas para o carrinho-------------
app.post("/carrinho/adicionar", cors(configCors),(req,res)=>{
    const dados = new Carrinho(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:"Item Adicionado"});
    }).catch((error)=> console.error(`Ocorreu um erro ao tentar adiciionar ao carrinho - ${error}`));
    
});
app.get("/carrinho/itens", cors(configCors),(req,res)=>{
    Carrinho.find((error,dados)=>{
        if(error){
            res.status(400).send({rs:`Ocorreu um erro ao tentar listar os itens do carrinho - ${error}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});
app.delete("/carrinho/removeitem/:id",cors(configCors),(req,res)=>{
    Carrinho.findByIdAndDelete(req.params.id,(error,dados)=>{
        if(error){
            res.status(400).send({rs:`Ocorreu um erro ao tentar deletar os itens do carrinho - ${error}`});
            return;
        }
        res.status(204).send({rs:'item removido'});
    });
});
//Rotas para o usuario 
app.post("/usuario/cadastro",cors(configCors),(req,res)=>{
    const dados = new Usuario(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:`Cadastro efetuado com sucesso`});
    }).catch((error)=>res.status(400).send({rs:`Erro ao tentar cadastrar ${error}`}))
})
app.post("/usuario/login",cors(configCors),(req,res)=>{
    const us = req.body.nomeusuario;
    const sh = req.body.senha;
    Usuario.find({nomeusuario:us,senha:sh},
        (erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar executar a consulta ${erro}`})
            return;
        }
        res.status(200).send({rs:dados});
    });
})
app.put("/usuario/atualizar/:id",cors(configCors),(req,res)=>{
    Usuario.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erros ao tentar atualizar ${erro}`});
            return;
        }
        res.status(200).send({rs:`Dados atualizados`})
    })
})
app.listen("2500", ()=>console.log("Servidor online na porta 2500"));