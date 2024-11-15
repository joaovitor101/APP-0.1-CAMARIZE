import express from 'express';
const router = express.Router();

import Especif_camarao from "../Models/Especif_camarao.js";

// Rota principal - Exibir especificacoes
router.get("/especificacoes", function (req, res) {
    Especif_camarao.findAll().then((especificacoes) => {
        res.render("especificacoes", {
            especificacoes: especificacoes
        });
    }).catch((error) => {
        console.log("Erro ao buscar especificacoes:", error);
        res.status(500).send("Erro ao buscar especificacoes.");
    });
});

// Cadastro de especificacoes
router.post("/especificacoes/new", (req, res) => {
    const { id_dieta, id_condicao } = req.body;

    Especif_camarao.create({
      id_dieta,
      id_condicao
    }).then(() => {
        res.redirect("/especificacoes");
    }).catch((error) => {
        console.log("Erro ao criar especificacoes:", error);
        res.status(500).send("Erro ao criar especificacoes.");
    });
});

// Excluir especificacoes
router.get("/especificacoes/delete/:id_especif", (req, res) => {
    const id = req.params.id_especif;

    Especif_camarao.destroy({
        where: {
            id_especif: id,
        },
    })
    .then(() => {
        res.redirect("/especificacoes");
    })
    .catch((error) => {
        console.log("Erro ao excluir especificacoes:", error);
        res.status(500).send("Erro ao excluir especificacoes.");
    });
});

// Editar especificacoes
router.get("/especificacoes/edit/:id_especif", (req, res) => {
    const id = req.params.id_especif;
    
    Especif_camarao.findByPk(id).then((especificacao) => {
        res.render("especificacoesEdit", {
            especificacao: especificacao, // Nome da variável ajustado
        });
    }).catch((error) => {
        console.log("Erro ao buscar especificacoes para edição:", error);
        res.status(500).send("Erro ao buscar especificacoes para edição.");
    });
});

// Atualizar especificacoes
router.post("/especificacoes/update", (req, res) => {
    const { id_especif, id_dieta, id_condicao } = req.body;

    Especif_camarao.update(
      { id_dieta, id_condicao },
      { where: { id_especif } }
    )
    .then(() => {
        res.redirect("/especificacoes");
    })
    .catch((error) => {
        console.log("Erro ao atualizar especificacoes:", error);
        res.status(500).send("Erro ao atualizar especificacoes.");
    });
});

export default router;
