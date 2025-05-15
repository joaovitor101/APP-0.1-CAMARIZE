import express from "express";
import Dietas from "../Models/Dieta.js";
import Especif_camarao from "../Models/Especif_camarao.js";
import Condicoes_ideais from "../Models/Condicao_ideal.js";

const router = express.Router();

// Rota para listar dietas
router.get("/dietas", (req, res) => {
  Dietas.findAll()
    .then((dietas) => {
      res.render("dietas", { dietas });
    })
    .catch((error) => {
      console.log("Erro ao buscar dieta:", error);
      res.status(500).send("Erro ao buscar dieta.");
    });
});

// Rota para exibir o formulário de nova dieta
router.get("/dietas/new", (req, res) => {
  const { id_tipo_camarao } = req.query;

  if (!id_tipo_camarao) {
    return res.status(400).send("ID do tipo de camarão não fornecido.");
  }

  res.render("dietas", { id_tipo_camarao });
});

// Rota para criar nova dieta
router.post("/dietas/new", async (req, res) => {
  const { descricao, id_tipo_camarao, horaAlimentacao, quantidade } = req.body;

  if (!id_tipo_camarao || !horaAlimentacao || !quantidade) {
    return res.status(400).send("Preencha todos os campos obrigatórios.");
  }

  try {
    // Cria nova dieta com os campos corretos
    const novaDieta = await Dietas.create({
      descricao,
      horaAlimentacao,
      quantidade,
    });

    // Busca condições ideais relacionadas ao tipo de camarão
    const condicoes = await Condicoes_ideais.findAll({
      where: { id_tipo_camarao },
    });

    if (condicoes.length === 0) {
      return res
        .status(404)
        .send("Nenhuma condição ideal encontrada para este tipo de camarão.");
    }

    // Associa condições ideais à nova dieta
    for (const condicao of condicoes) {
      await Especif_camarao.create({
        id_tipo_camarao,
        id_dieta: novaDieta.id_dieta,
        id_condicao: condicao.id_condicao,
      });
    }

    res.redirect("/cativeiros");
  } catch (error) {
    console.error("Erro ao cadastrar dieta:", error);
    res.status(500).send("Erro ao cadastrar dieta.");
  }
});

export default router;
