import express from 'express';
import connection from './config/sequelize-config.js';
const app = express()

//importar models aqui
import Tipos_camarao from "./Models/Camarao.js"; 
import Cativeiros from "./Models/Cativeiro.js"; 
import Dietas from "./Models/Dieta.js";
import Condicoes_ideais from "./Models/Condicao_ideal.js";
import Tipos_sensor from './Models/Tipos_sensor.js';
import Especif_camarao from './Models/Especif_camarao.js';
import SitiosxCativeiros from './Models/SitiosxCativeiros.js';
import Sitios from './Models/Sitio.js';
import Sensores from './Models/Sensor.js';
import UsuariosxSitios from './Models/UsuarioxSitio.js';
import SensoresxCativeiros from './Models/SensorxCativeiro.js';

//importar controllers aqui
import CamaroesController from "./Controllers/CamaroesController.js";
import CativeirosController from "./Controllers/CativeirosController.js";
import DietasController from "./Controllers/DietasController.js";
import Condicoes_ideaisController from "./Controllers/Condicoes_ideaisController.js"
import SitiosController from "./Controllers/SitiosController.js"; 
import UsersController from "./Controllers/UsersController.js";
import DashboardControllers from "./Controllers/dashboardControllers.js";
import Tipos_sensorController from "./Controllers/Tipos_sensorController.js";
import Especif_camaraoController from "./Controllers/Especif_camaraoController.js";
import RelatoriosController from "./Controllers/relatoriosController.js";
import NotificacoesController from './Controllers/NotificacoesController.js';
import SensoresController from "./Controllers/SensoresController.js";
import SensoresxCativeirosController from "./Controllers/SensoresxCativeirosController.js"; 

// Configurações do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')

// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'))

import flash from "express-flash";
import session from "express-session";

// Usando o flash
app.use(flash());

// Usando session
app.use(
  session({
    secret: "camarizesecret",
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false,
  })
);

// Rota para teste de mensagem de sucesso
app.get('/set-flash', (req, res) => {
  req.flash('success', 'Mensagem de sucesso!');
  res.redirect('/');
});

// Permite capturar dados vindos de formulários
app.use('/imgs', express.static('/imgs'));

// Definindo o uso das rotas dos Controllers
app.use("/", SitiosController)
app.use("/", UsersController)
app.use("/", DashboardControllers)
app.use("/", CamaroesController);
app.use("/", CativeirosController);
app.use("/", DietasController);
app.use("/", Condicoes_ideaisController);
app.use("/", Tipos_sensorController);
app.use("/", Especif_camaraoController);
app.use("/", RelatoriosController)
app.use("/", NotificacoesController)
app.use("/", SensoresController);
app.use("/", SensoresxCativeirosController); 
// Realizando a conexão com o banco de dados
(async () => {
  try {
    await connection.authenticate();
    console.log("Conexão feita com sucesso");

    await connection.query("CREATE DATABASE IF NOT EXISTS camarize;");
    console.log("Banco criado");

    // Ordem importa aqui
    await Tipos_camarao.sync({ force: false });
    await Sitios.sync({ force: false });
    await Condicoes_ideais.sync({ force: false });
    await Dietas.sync({ force: false });
    await Especif_camarao.sync({ force: false });
    await Cativeiros.sync({ force: false });
    await SitiosxCativeiros.sync({ force: false });
    await Tipos_sensor.sync({ force: false });
    await Sensores.sync({ force: false });
    await UsuariosxSitios.sync({ force: false });
    await SensoresxCativeiros.sync({ force: false });

    console.log("Tabelas sincronizadas com sucesso");
  } catch (error) {
    console.log("Erro na conexão ou criação do banco:", error);
  }
})();


// ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.render("index", {
        successMessage: req.flash("success"),
        errorMessage: req.flash("error"),
    });
});

// INICIA O SERVIDOR NA PORTA 3000
app.listen(3000, function(erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});
