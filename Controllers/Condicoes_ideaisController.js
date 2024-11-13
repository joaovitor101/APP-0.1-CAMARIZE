import express from 'express';
const router = express.Router();

import Condicoes_ideais from "../Models/Condicao_ideal.js";

// Rota principal - Exibir condicoes
router.get("/condicoes", function (req, res) {
    Condicoes_ideais.findAll().then((condicoes) => {
        res.render("condicoes", {
            condicoes: condicoes
        });
    }).catch((error) => {
        console.log("Erro ao buscar condicoes:", error);
        res.status(500).send("Erro ao buscar condicoes.");
    });
});

// Cadastro de condicoes
router.post("/condicoes/new", (req, res) => {
    const { id_tipo_camarao, temp_ideal, ph_ideal, amonia_ideal } = req.body;

    Condicoes_ideais.create({
      id_tipo_camarao,
      temp_ideal,
      ph_ideal,
      amonia_ideal
    }).then(() => {
        res.redirect("/condicoes");
    }).catch((error) => {
        console.log("Erro ao criar condicoes:", error);
        res.status(500).send("Erro ao criar condicoes.");
    });
});

// Excluir condicoes
router.get("/condicoes/delete/:id_condicao", (req, res) => {
    const id = req.params.id_condicao;

    Condicoes_ideais.destroy({
        where: {
            id_condicao: id,
        },
    })
    .then(() => {
        res.redirect("/condicoes");
    })
    .catch((error) => {
        console.log("Erro ao excluir condicoes:", error);
        res.status(500).send("Erro ao excluir condicoes.");
    });
});

// Editar condicoes
router.get("/condicoes/edit/:id_condicao", (req, res) => {
    const id = req.params.id_condicao;
    
    Condicoes_ideais.findByPk(id).then((condicao) => {
        res.render("condicoesEdit", {
            condicao: condicao, // Nome da variável ajustado
        });
    }).catch((error) => {
        console.log("Erro ao buscar condicao para edição:", error);
        res.status(500).send("Erro ao buscar condicao para edição.");
    });
});

// Atualizar condicoes
router.post("/condicoes/update", (req, res) => {
    const { id_condicao, id_tipo_camarao, temp_ideal, ph_ideal, amonia_ideal } = req.body;

    Condicoes_ideais.update(
      { id_tipo_camarao,temp_ideal, ph_ideal, amonia_ideal },
      { where: { id_condicao } }
    )
    .then(() => {
        res.redirect("/condicoes");
    })
    .catch((error) => {
        console.log("Erro ao atualizar condicoes:", error);
        res.status(500).send("Erro ao atualizar condicoes.");
    });
});

export default router;
