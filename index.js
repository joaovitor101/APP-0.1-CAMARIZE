import express from 'express';
import connection from './config/sequelize-config.js'
import ClientesController from "./Controllers/ClientesController.js";
import FazendaControllers from "./Controllers/FazendaControllers.js" 
import TanqueConstrollers from "./Controllers/TanqueControllers.js";
import UsersController from "./Controllers/UsersController.js";
import flash from "express-flash";
import session from "express-session";


const app = express()
app.use(flash());

app.use(
	session({
		secret: "lojasecret",
		cookie: { maxAge: 3600000 },
		saveUninitialized: false,
		resave: false,
	})
);

// Permite capturar dados vindos de formulários
app.use('/imgs', express.static('/imgs'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.use("/", FazendaControllers)
app.use("/", TanqueConstrollers)
app.use("/", UsersController)
// ROTA PRINCIPAL
app.get("/", (req, res) => {
	res.render("index", {
		successMessage: req.flash("success"),
		errorMessage: req.flash("error"),
	});
});

// app.post("/upload", upload.single("file"), (req, res) =>{
//     res.send("Arquivo Recebido !")
// })
// INICIA O SERVIDOR NA PORTA 8080
app.listen(4040,function(erro){
    if(erro) {
        console.log("Ocorreu um erro!")

    }else{
        console.log("Servidor iniciado com sucesso!")
    }
})



