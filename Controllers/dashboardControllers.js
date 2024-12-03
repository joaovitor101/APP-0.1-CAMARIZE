import express from 'express';
import SensoresxCativeiros from '../Models/SensorxCativeiro.js';
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
                as: 'sensor',  // alias definido na associação
                attributes: ['id_sensor', 'apelido', 'foto_sensor'],  // atributos que deseja retornar
            }
        });

        // Verifica se encontrou sensores associados
        if (sensoresAssociados.length === 0) {
            req.flash('error', 'Nenhum sensor encontrado para este cativeiro.');
        }

        // Passa as mensagens de flash e os sensores para o EJS
        res.render("dashboard", {
            success: req.flash('success'),
            error: req.flash('error'),
            sensores: sensoresAssociados.map(item => item.sensor),  // Mapear os sensores
            id_cativeiro: id_cativeiro  // Passar id_cativeiro para a view
        });
    } catch (error) {
        console.error('Erro ao carregar sensores associados ao cativeiro:', error);
        req.flash('error', 'Erro ao carregar sensores.');
        res.redirect('/dashboard');  // Redireciona em caso de erro
    }
});


export default router;
