import express from 'express';
import SensoresxCativeiros from '../Models/SensorxCativeiro.js';
import Parametros_atuais from '../Models/Parametros_atuais.js';
import Sensores from '../Models/Sensor.js';

const router = express.Router();

router.get("/dashboard/:id_cativeiro", async (req, res) => {
  const { id_cativeiro } = req.params;

  try {
    // Sensores associados
    const sensoresAssociados = await SensoresxCativeiros.findAll({
      where: { id_cativeiro },
      include: {
        model: Sensores,
        as: 'sensor',
        attributes: ['id_sensor', 'apelido', 'foto_sensor'],
      }
    });

    // Último parâmetro atual
    const ultimoParametro = await Parametros_atuais.findOne({
      where: { id_cativeiro },
      order: [['datahora', 'DESC']]
    });

    // Buscar dados históricos últimos 7 dias (ajuste o campo e modelo conforme seu banco)
    const historico = await Parametros_atuais.findAll({
      where: { id_cativeiro },
      order: [['datahora', 'ASC']], // crescente, do mais antigo ao mais recente
      limit: 7
    });

    // Montar arrays para o gráfico
    const dadosSemanais = {
      temp: [],
      ph: [],
      amonia: []
    };

    historico.forEach(item => {
      dadosSemanais.temp.push(item.temp_atual ?? 0);     // Ajuste o campo conforme seu model
      dadosSemanais.ph.push(item.ph_atual ?? 0);
      dadosSemanais.amonia.push(item.amonia_atual ?? 0);
    });

    if (sensoresAssociados.length === 0) {
      req.flash('error', 'Nenhum sensor encontrado para este cativeiro.');
    }

    res.render("dashboard", {
      success: req.flash('success'),
      error: req.flash('error'),
      sensores: sensoresAssociados.map(item => item.sensor),
      dados: ultimoParametro,
      dadosSemanais,
      id_cativeiro
    });
  } catch (error) {
    console.error('Erro ao carregar o dashboard:', error);
    req.flash('error', 'Erro ao carregar dados do dashboard.');
    res.redirect('/dashboard');
  }
});

export default router;
