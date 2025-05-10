import express from 'express';
import SensoresxCativeiros from '../Models/SensorxCativeiro.js';
import Parametros_atuais from '../Models/Parametros_atuais.js';

import Sensores from '../Models/Sensor.js';

const router = express.Router();

// Rota para exibir o dashboard de um cativeiro específico
router.get("/dashboard/:id_cativeiro", async (req, res) => {
    const { id_cativeiro } = req.params;

    try {
        // Buscar os sensores associados ao cativeiro
        const sensoresAssociados = await SensoresxCativeiros.findAll({
            where: { id_cativeiro },
            include: {
                model: Sensores,
                as: 'sensor',
                attributes: ['id_sensor', 'apelido', 'foto_sensor'],
            }
        });

        // Buscar o último parâmetro registrado para esse cativeiro
        const ultimoParametro = await Parametros_atuais.findOne({
            where: { id_cativeiro },
            order: [['datahora', 'DESC']]
        });

        if (sensoresAssociados.length === 0) {
            req.flash('error', 'Nenhum sensor encontrado para este cativeiro.');
        }

        res.render("dashboard", {
            success: req.flash('success'),
            error: req.flash('error'),
            sensores: sensoresAssociados.map(item => item.sensor),
            dados: ultimoParametro, // <-- Aqui estão os dados dos sensores!
            id_cativeiro
        });
    } catch (error) {
        console.error('Erro ao carregar o dashboard:', error);
        req.flash('error', 'Erro ao carregar dados do dashboard.');
        res.redirect('/dashboard');
    }
});


export default router;
