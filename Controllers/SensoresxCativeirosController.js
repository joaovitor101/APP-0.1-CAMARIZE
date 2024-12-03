import express from 'express';
import Sensores from "../Models/Sensor.js"; 
import Tipos_sensor from "../Models/Tipos_sensor.js"; 
import SensoresxCativeiros from "../Models/SensorxCativeiro.js";
import Cativeiros from "../Models/Cativeiro.js";
import flash from 'connect-flash';
import Auth from "../middleware/Auth.js";

const router = express.Router();

// Exibe o formulário de associação
router.get('/sensores/associar', async (req, res) => {
  try {
    const sensores = await Sensores.findAll({
      include: {
        model: Tipos_sensor, 
        as: 'tipo_sensor',
        attributes: ['descricao'], 
      },
    });

    const cativeiros = await Cativeiros.findAll();

    res.render('sensoresAssociar', { sensores, cativeiros });
  } catch (error) {
    console.error('Erro ao carregar sensores e cativeiros:', error);
    res.status(500).send(`Erro ao carregar dados: ${error.message}`);
  }
});

// Cadastrar associação entre sensor e cativeiro
router.post('/sensores/associar', async (req, res) => {
    const { id_sensor, id_cativeiro } = req.body;
    console.log("ID Sensor:", id_sensor);
    console.log("ID Cativeiro:", id_cativeiro);
  
    try {
      await SensoresxCativeiros.create({ id_sensor, id_cativeiro });
      res.redirect(`/dashboard/${id_cativeiro}`);
    } catch (error) {
      console.error('Erro ao associar sensor e cativeiro:', error);
      res.status(500).send('Erro ao associar sensor e cativeiro.');
    }
  });
  
  // Rota para desassociar
router.get('/sensores/desassociar/:id_sensor/:id_cativeiro', async (req, res) => {
  const { id_sensor, id_cativeiro } = req.params;

  try {
      // deleta associacao
      const resultado = await SensoresxCativeiros.destroy({
          where: {
              id_sensor: id_sensor,
              id_cativeiro: id_cativeiro,
          },
      });

      if (resultado === 0) {
          req.flash('error', 'Associação não encontrada.');
      } else {
          req.flash('success', 'Sensor desassociado com sucesso.');
      }
      res.redirect(`/dashboard/${id_cativeiro}`);
  } catch (error) {
      console.error('Erro ao desassociar sensor:', error);
      req.flash('error', 'Erro ao desassociar sensor.');
      res.redirect(`/dashboard/${id_cativeiro}`);
  }
});

export default router;
