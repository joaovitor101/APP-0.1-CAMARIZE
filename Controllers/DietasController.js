// Controllers/DietasController.js

import Dietas from "../Models/Dieta.js";
import Especif_camarao from "../Models/Especif_camarao.js";
import Condicoes_ideais from "../Models/Condicao_ideal.js";

async function listar(req, res) {
  try {
    const dietas = await Dietas.findAll();
    res.render("dietas", { dietas });
  } catch (error) {
    console.log("Erro ao buscar dieta:", error);
    res.status(500).send("Erro ao buscar dieta.");
  }
}

function exibirFormulario(req, res) {
  const { id_tipo_camarao } = req.query;
  if (!id_tipo_camarao) {
    return res.status(400).send("ID do tipo de camarão não fornecido.");
  }
  res.render("dietas", { id_tipo_camarao });
}

async function criar(req, res) {
  const { descricao, id_tipo_camarao, horaAlimentacao, quantidade } = req.body;

  if (!id_tipo_camarao || !horaAlimentacao || !quantidade) {
    return res.status(400).send("Preencha todos os campos obrigatórios.");
  }

  try {
    const novaDieta = await Dietas.create({
      descricao,
      horaAlimentacao,
      quantidade,
    });

    const condicoes = await Condicoes_ideais.findAll({
      where: { id_tipo_camarao },
    });

    if (condicoes.length === 0) {
      return res
        .status(404)
        .send("Nenhuma condição ideal encontrada para este tipo de camarão.");
    }

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
}

async function buscarDietaAtual(req, res) {
  try {
    const dieta = await Dietas.findOne({
      order: [["id_dieta", "DESC"]],
    });

    if (!dieta) {
      return res.status(404).json({ message: "Nenhuma dieta encontrada" });
    }

    res.json({
      horaAlimentacao: dieta.horaAlimentacao,
      quantidade: dieta.quantidade,
    });
  } catch (error) {
    console.error("Erro ao buscar dieta atual:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
}
async function atualizarDieta(req, res) {
  try {
    const { id } = req.params; // pega o id da URL
    const { horaAlimentacao, quantidade } = req.body;

    const dieta = await Dietas.findByPk(id);
    if (!dieta) {
      return res.status(404).json({ message: "Dieta não encontrada" });
    }

    dieta.horaAlimentacao = horaAlimentacao;
    dieta.quantidade = quantidade;

    await dieta.save();

    res.json({ message: "Dieta atualizada com sucesso!", dieta });
  } catch (error) {
    console.error("Erro ao atualizar dieta:", error);
    res.status(500).json({ error: "Erro ao atualizar dieta" });
  }
}


export default {
  listar,
  exibirFormulario,
  criar,
  buscarDietaAtual,
  atualizarDieta, // NÃO esqueça de exportar!
};
