import express from 'express';
const router = express.Router();
import { Sequelize } from 'sequelize';
import Parametros_atuais from '../models/Parametros_atuais.js';
import Condicoes_ideais from '../models/Condicao_ideal.js';
import Cativeiros from '../models/Cativeiro.js';
import Tipos_camarao from '../models/Camarao.js'; // Importante!

// Rota de notificações
router.get('/notificacoes', async (req, res) => {
  try {
    const parametros = await Parametros_atuais.findAll({
      include: [
        {
          model: Cativeiros,
          include: [
            {
              model: Tipos_camarao,
              as: 'tipo_camarao',
              include: [
                {
                  model: Condicoes_ideais,
                  as: 'condicoes_ideais'
                }
              ]
            }
          ]
        }
      ]
    });

    const notifications = [];

    parametros.forEach(param => {
      const ideal = param.Cativeiro?.tipo_camarao?.condicoes_ideais;

      if (!ideal) return;

      if (param.ph_atual !== ideal.ph_ideal) {
        notifications.push({
          image: "ph_sensor.png",
          title: "O pH da água está diferente do ideal!",
          tank: `Tanque ${param.id_cativeiro}`,
          time: param.datahora.toLocaleTimeString()
        });
      }

      if (param.amonia_atual !== ideal.amonia_ideal) {
        notifications.push({
          image: "amonia_sensor.png",
          title: "Nível de amônia fora do ideal!",
          tank: `Tanque ${param.id_cativeiro}`,
          time: param.datahora.toLocaleTimeString()
        });
      }

      if (param.temp_atual !== ideal.temp_ideal) {
        notifications.push({
          image: "temp_sensor.png",
          title: "Temperatura diferente do ideal!",
          tank: `Tanque ${param.id_cativeiro}`,
          time: param.datahora.toLocaleTimeString()
        });
      }
    });

    res.render('notificacoes', { notifications });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar notificações");
  }
});

export default router;
