import Parametros_atuais from "../Models/Parametros_atuais.js";

async function criar(req, res) {
  try {
    const { datahora, temp_atual, ph_atual, amonia_atual, id_cativeiro } = req.body;

    await Parametros_atuais.create({
      datahora,
      temp_atual,
      ph_atual,
      amonia_atual,
      id_cativeiro,
    });

    res.status(201).json({ message: "Parâmetros cadastrados com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar parâmetros:", error);
    res.status(500).json({ error: "Erro ao criar parâmetros" });
  }
}

async function buscarUltimo(req, res) {
  try {
    const ultimo = await Parametros_atuais.findOne({
      order: [['datahora', 'DESC']],
    });

    if (!ultimo) {
      return res.status(404).json({ message: "Nenhum dado encontrado" });
    }

    res.json(ultimo);
  } catch (error) {
    console.error("Erro ao buscar o último parâmetro:", error);
    res.status(500).json({ error: "Erro ao buscar o último parâmetro" });
  }
}

export default {
  criar,
  buscarUltimo,
};
