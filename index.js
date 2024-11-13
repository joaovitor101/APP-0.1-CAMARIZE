import express from 'express';
import connection from './config/sequelize-config.js'
const app = express()

//importar models aqui
import Tipos_camarao from "./Models/Camarao.js"; 
import Cativeiros from "./Models/Cativeiro.js"; 
import Dietas from "./Models/Dieta.js";
import Condicoes_ideais from "./Models/Condicao_ideal.js";


//importar controllers aqui
import CamaroesController from "./Controllers/CamaroesController.js";
import CativeirosController from "./Controllers/CativeirosController.js";
import DietasController from "./Controllers/DietasController.js";
import Condicoes_ideaisController from "./Controllers/Condicoes_ideaisController.js"
import ClientesController from "./Controllers/ClientesController.js";
import FazendaControllers from "./Controllers/FazendaControllers.js" 
import UsersController from "./Controllers/UsersController.js";
import DashboardControllers from "./Controllers/dashboardControllers.js";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')

// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'))

import flash from "express-flash";
import session from "express-session";



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

// Definindo o uso das rotas dos Controllers
app.use("/", ClientesController)
app.use("/", FazendaControllers)
app.use("/", UsersController)
app.use("/", DashboardControllers)
app.use("/", CamaroesController);
app.use("/", CativeirosController);
app.use("/",DietasController);
app.use("/", Condicoes_ideaisController);

// Realizando a conexão com o banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso");

    return connection.query('CREATE DATABASE IF NOT EXISTS camarize;');
}).then(() => {
    console.log("Banco criado");
    // Sincronizar tabelas
    return Promise.all([
        Tipos_camarao.sync({ force: false }), 
        Condicoes_ideais.sync({ force: false }), 
        //Especif_camarao.sync({ force: false }),
        Dietas.sync({ force: false }), 
        Cativeiros.sync({ force: false }), 
        //Dispensadores.sync({ force: false }), 
        //Alimentacao.sync({ force: false }),
        //SensoresXcativeiros.sync({ force: false }),
        //Sensores.sync({ force: false }), 
        //Tipos_sensor.sync({ force: false }), 
        //Relatorio_individual.sync({ force: false }), 
        //Parametros_atuais.sync({ force: false }), 
        //SitiosxCativeiros.sync({ force: false }), 
        //Sitios.sync({ force: false }), 
        //UsuariosxSitios.sync({ force: false }), 
        //Usuarios.sync({ force: false }), 
        //Recomendacoes.sync({ force: false }), 
        //Relatorio_geral.sync({ force: false }), 
        //Notificacoes.sync({ force: false })

    ]);
}).then(() => {
    console.log("Tabelas sincronizadas com sucesso");
}).catch((error) => {
    console.log("Erro na conexão ou criação do banco:", error);
});



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
app.get("/", function(req, res) {
    res.render("index");
});

app.listen(3000, function(erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});