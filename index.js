import express from 'express'
import connection from './config/sequelize-config.js'
import ClientesController from "./Controllers/ClientesController.js";
// import FazendaControllers from "./Controllers/FazendaControllers.js" 
import TanqueConstrollers from "./Controllers/TanqueControllers.js"

const app = express()

// Permite capturar dados vindos de formulários
app.use('/imgs', express.static('views/imgs'));
app.use(express.urlencoded({extended: false}))

// Realizando a conexão com o banco de dados
connection.authenticate().then(() => {
    console.log ("Conexão com o banco de dados feita com sucesso!")
}).catch((error) => {
    console.log(error)
})

connection.query(`create database if not exists camarize;`).then(() => {
    console.log("O banco de dados está criado.")
}).catch((error) => {
    console.log(error)
})

// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')

// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'))

// Definindo o uso das rotas dos Controllers
app.use("/", ClientesController)
// app.use("/", FazendaControllers)
app.use("/", TanqueConstrollers)

// ROTA PRINCIPAL
app.get("/",function(req,res){
    res.render("index")
})

// INICIA O SERVIDOR NA PORTA 8080
app.listen(8080,function(erro){
    if(erro) {
        console.log("Ocorreu um erro!")

    }else{
        console.log("Servidor iniciado com sucesso!")
    }
})