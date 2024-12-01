import express from 'express';
const router = express.Router();
import Condicoes_ideais from "../Models/Condicao_ideal.js";

// Rota principal - Exibir condições
router.get("/condicoes", (req, res) => {
    Condicoes_ideais.findAll()
        .then((condicoes) => {
            res.render("condicoes", {
                condicoes: condicoes
            });
        })
        .catch((error) => {
            console.log("Erro ao buscar condições:", error);
            res.status(500).send("Erro ao buscar condições.");
        });
});

// GET para exibir o formulário de condições
router.get("/condicoes/new", (req, res) => {
    const id_tipo_camarao = req.query.id_tipo_camarao; // Obtendo o parâmetro da query string
    
    if (!id_tipo_camarao) {
        return res.status(400).send("ID do tipo de camarão não fornecido.");
    }

    // Renderiza o formulário passando o id_tipo_camarao
    res.render("condicoes", { id_tipo_camarao });
});

// Cadastro de condições
router.post("/condicoes/new", (req, res) => {
    const { id_tipo_camarao, temp_ideal, ph_ideal, amonia_ideal } = req.body;

    // Convertendo valores para número, caso necessário
    const tempIdeal = parseFloat(temp_ideal);
    const phIdeal = parseFloat(ph_ideal);
    const amoniaIdeal = parseFloat(amonia_ideal);

    // Certificando-se de que os valores são válidos
    if (isNaN(tempIdeal) || isNaN(phIdeal) || isNaN(amoniaIdeal)) {
        return res.status(400).send("Valores inválidos para temperatura, pH ou amônia.");
    }

    // Criação das condições ideais
    Condicoes_ideais.create({
        id_tipo_camarao,
        temp_ideal: tempIdeal,
        ph_ideal: phIdeal,
        amonia_ideal: amoniaIdeal
    })
    .then(() => {
        // Após a criação, redireciona para a próxima etapa, passando o id_tipo_camarao como parâmetro
        res.redirect(`/dietas/new?id_tipo_camarao=${id_tipo_camarao}`);
    })
    .catch((error) => {
        console.log("Erro ao criar condições:", error);
        res.status(500).send("Erro ao criar condições.");
    });
});

// Excluir condições
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
        console.log("Erro ao excluir condições:", error);
        res.status(500).send("Erro ao excluir condições.");
    });
});

// Editar condições
router.get("/condicoes/edit/:id_condicao", (req, res) => {
    const id = req.params.id_condicao;
    
    Condicoes_ideais.findByPk(id)
        .then((condicao) => {
            res.render("condicoesEdit", {
                condicao: condicao, // Passando a condição para edição
            });
        })
        .catch((error) => {
            console.log("Erro ao buscar condição para edição:", error);
            res.status(500).send("Erro ao buscar condição para edição.");
        });
});

// Atualizar condições
router.post("/condicoes/update", (req, res) => {
    const { id_condicao, id_tipo_camarao, temp_ideal, ph_ideal, amonia_ideal } = req.body;

    Condicoes_ideais.update(
        { id_tipo_camarao, temp_ideal, ph_ideal, amonia_ideal },
        { where: { id_condicao } }
    )
    .then(() => {
        res.redirect("/condicoes");
    })
    .catch((error) => {
        console.log("Erro ao atualizar condições:", error);
        res.status(500).send("Erro ao atualizar condições.");
    });
});

export default router;
