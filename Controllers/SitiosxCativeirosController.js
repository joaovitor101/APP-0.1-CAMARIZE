import express from 'express';
const router = express.Router();

import SitiosxCativeiros from "../Models/SitiosxCativeiros.js";

// Rota principal - Exibir especificacoes
router.get("/sitiosxcativeiros", function (req, res) {
    SitiosxCativeiros.findAll().then((sitiosxcativeiros) => {
        res.render("sitiosxcativeiros", {
            sitiosxcativeiros: sitiosxcativeiros
        });
    }).catch((error) => {
        console.log("Erro ao buscar sitiosxcativeiros:", error);
        res.status(500).send("Erro ao buscar sitiosxcativeiros.");
    });
});

// Cadastro de sitiosxcativeiros
router.post("/sitiosxcativeiros/new", (req, res) => {
    const { id_sitio, id_cativeiro } = req.body;

    SitiosxCativeiros.create({
        id_sitio,
        id_cativeiro
    }).then(() => {
        res.redirect("/sitiosxcativeiros");
    }).catch((error) => {
        console.log("Erro ao criar sitiosxcativeiros:", error);
        res.status(500).send("Erro ao criar sitiosxcativeiros.");
    });
});

// Excluir sitiosxcativeiros
router.get("/sitiosxcativeiros/delete/:id_especif", (req, res) => {
    const id = req.params.id_sitio_cativieiro;

    SitiosxCativeiros.destroy({
        where: {
            id_sitio_cativieiro: id,
        },
    })
    .then(() => {
        res.redirect("/sitiosxcativeiros");
    })
    .catch((error) => {
        console.log("Erro ao excluir sitiosxcativeiros:", error);
        res.status(500).send("Erro ao excluir sitiosxcativeiros.");
    });
});


// Atualizar sitiosxcativeiros
router.post("/sitiosxcativeiros/update", (req, res) => {
    const { id_sitio_cativieiro, id_sitio, id_cativeiro } = req.body;

    SitiosxCativeiros.update(
      { id_sitio, id_cativeiro },
      { where: { id_sitio_cativieiro } }
    )
    .then(() => {
        res.redirect("/sitiosxcativeiros");
    })
    .catch((error) => {
        console.log("Erro ao atualizar sitiosxcativeiros:", error);
        res.status(500).send("Erro ao atualizar sitiosxcativeiros.");
    });
});

export default router;
