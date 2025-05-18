import express from 'express';
import connection from './Config/sequelize-config.js';
import cors from 'cors';
import flash from 'express-flash';
import session from 'express-session';

const app = express();

// Importar routers e controllers
import parametrosRoutes from './Routes/parametros.js';
import dietasRoutes from "./Routes/dietas.js";
import CamaroesController from './Controllers/CamaroesController.js';
import CativeirosController from './Controllers/CativeirosController.js';
import DietasController from './Controllers/DietasController.js';
import Condicoes_ideaisController from './Controllers/Condicoes_ideaisController.js';
import SitiosController from './Controllers/SitiosController.js';
import UsersController from './Controllers/UsersController.js';
import DashboardControllers from './Controllers/dashboardControllers.js';
import Tipos_sensorController from './Controllers/Tipos_sensorController.js';
import Especif_camaraoController from './Controllers/Especif_camaraoController.js';
import RelatoriosController from './Controllers/relatoriosController.js';
import NotificacoesController from './Controllers/NotificacoesController.js';
import SensoresController from './Controllers/SensoresController.js';
import SensoresxCativeirosController from './Controllers/SensoresxCativeirosController.js';

// Importar models
import Tipos_camarao from './Models/Camarao.js';
import Cativeiros from './Models/Cativeiro.js';
import Dietas from './Models/Dieta.js';
import Condicoes_ideais from './Models/Condicao_ideal.js';
import Tipos_sensor from './Models/Tipos_sensor.js';
import Especif_camarao from './Models/Especif_camarao.js';
import SitiosxCativeiros from './Models/SitiosxCativeiros.js';
import Sitios from './Models/Sitio.js';
import Sensores from './Models/Sensor.js';
import UsuariosxSitios from './Models/UsuarioxSitio.js';
import SensoresxCativeiros from './Models/SensorxCativeiro.js';
import Parametros_atuais from './Models/Parametros_atuais.js';

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: 'camarizesecret',
    cookie: { maxAge: 3600000 },
    saveUninitialized: false,
    resave: false,
  })
);

// View engine e arquivos estáticos
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/imgs', express.static('/imgs'));

// Rota para teste de mensagem de sucesso
app.get('/set-flash', (req, res) => {
  req.flash('success', 'Mensagem de sucesso!');
  res.redirect('/');
});

// Definição de rotas principais
app.use('/', SitiosController);
app.use('/', UsersController);
app.use('/', DashboardControllers);
app.use('/', CamaroesController);
app.use('/', CativeirosController);
app.use('/', Condicoes_ideaisController);
app.use('/', Tipos_sensorController);
app.use('/', Especif_camaraoController);
app.use('/', RelatoriosController);
app.use('/', NotificacoesController);
app.use('/', SensoresController);
app.use('/', SensoresxCativeirosController);
app.use('/', parametrosRoutes); // Corrigido: rota com router adequado
app.use('/', dietasRoutes);

// Conexão com o banco e sincronização
(async () => {
  try {
    await connection.authenticate();
    console.log('Conexão feita com sucesso');

    await connection.query('CREATE DATABASE IF NOT EXISTS camarize;');
    console.log('Banco criado');

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
    await Parametros_atuais.sync({ force: false });

    console.log('Tabelas sincronizadas com sucesso');
  } catch (error) {
    console.error('Erro na conexão ou criação do banco:', error);
  }
})();

// Rota principal
app.get('/', (req, res) => {
  res.render('index', {
    successMessage: req.flash('success'),
    errorMessage: req.flash('error'),
  });
});

// Iniciar o servidor
app.listen(3000, '0.0.0.0', (erro) => {
  if (erro) {
    console.log('Ocorreu um erro!');
  } else {
    console.log('Servidor iniciado com sucesso!. Acesse http://localhost:3000');
  }
});
