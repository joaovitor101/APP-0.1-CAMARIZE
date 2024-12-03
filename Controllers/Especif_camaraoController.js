import express from 'express';
const router = express.Router();

import Especif_camarao from '../Models/Especif_camarao.js';
import Condicoes_ideais from '../Models/Condicao_ideal.js';
import Dietas from '../Models/Dieta.js';

// Rota cadastrar
router.post('/especif_camarao/auto-cadastrar', async (req, res) => {
    try {
        //condicoes ideais
        const condicoes = await Condicoes_ideais.findAll();
        for (const condicao of condicoes) {
            const id_tipo_camarao = condicao.id_tipo_camarao;
            // Buscar a dieta
            const especif = await Especif_camarao.findOne({ 
                where: { id_tipo_camarao }, 
                include: [Dietas] 
            });

            if (!especif) {
                console.error(`Nenhuma dieta encontrada para o tipo de camarão: ${id_tipo_camarao}`);
                continue; 
            }

            // Criar
            await Especif_camarao.create({
                id_tipo_camarao: id_tipo_camarao,
                id_dieta: especif.Dieta.id_dieta, 
                id_condicao: condicao.id_condicao,
            });
        }

        res.send("Todos os dados foram cadastrados automaticamente na tabela especif_camarao!");
    } catch (error) {
        console.error("Erro ao cadastrar automaticamente:", error);
        res.status(500).send("Erro ao cadastrar automaticamente.");
    }
});

export default router;
