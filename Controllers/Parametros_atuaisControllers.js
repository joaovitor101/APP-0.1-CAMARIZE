import express from 'express';
const router = express.Router();

import Parametros_atuais from "../Models/Parametros_atuais.js";

// Rota principal - Exibir especificacoes
router.get("/parametros_atuais", function (req, res) {
    Parametros_atuais.findAll().then((parametros_atuais) => {
        res.render("parametros_atuais", {
            parametros_atuais: parametros_atuais
        });
    }).catch((error) => {
        console.log("Erro ao buscar parametros_atuais:", error);
        res.status(500).send("Erro ao buscar parametros_atuais.");
    });
});

// Cadastro de parametros_atuais
router.post("/parametros_atuais/new", (req, res) => {
    const { datahora, temp_atual, ph_atual, amonia_atual, id_cativeiro } = req.body;

    Parametros_atuais.create({
        datahora,
        temp_atual,
        ph_atual,
        amonia_atual,
        id_cativeiro
    }).then(() => {
        res.redirect("/parametros_atuais");
    }).catch((error) => {
        console.log("Erro ao criar parametros_atuais:", error);
        res.status(500).send("Erro ao criar parametros_atuais.");
    });
});

// Excluir parametros_atuais
router.get("/parametros_atuais/delete/:id_parametros_atuais", (req, res) => {
    const id = req.params.id_parametros_atuais;

    Parametros_atuais.destroy({
        where: {
            id_parametros_atuais: id,
        },
    })
    .then(() => {
        res.redirect("/parametros_atuais");
    })
    .catch((error) => {
        console.log("Erro ao excluir parametros_atuais:", error);
        res.status(500).send("Erro ao excluir parametros_atuais.");
    });
});

// Editar parametros_atuais
router.get("/parametros_atuais/edit/:id_parametros_atuais", (req, res) => {
    const id = req.params.id_parametros_atuais;
    
    Parametros_atuais.findByPk(id).then((parametro_atual) => {
        res.render("parametros_atuaisEdit", {
            parametro_atual: parametro_atual, // Nome da variável ajustado
        });
    }).catch((error) => {
        console.log("Erro ao buscar parametros_atuais para edição:", error);
        res.status(500).send("Erro ao buscar parametros_atuais para edição.");
    });
});

// Atualizar parametros_atuais
router.post("/parametros_atuais/update", (req, res) => {
    const { id_parametros_atuais, datahora, temp_atual, ph_atual, amonia_atual, id_cativeiro } = req.body;

    Parametros_atuais.update(
      { datahora, temp_atual, ph_atual, amonia_atual, id_cativeiro },
      { where: { id_parametros_atuais } }
    )
    .then(() => {
        res.redirect("/parametros_atuais");
    })
    .catch((error) => {
        console.log("Erro ao atualizar parametros_atuais:", error);
        res.status(500).send("Erro ao atualizar parametros_atuais.");
    });
});

export default router;
