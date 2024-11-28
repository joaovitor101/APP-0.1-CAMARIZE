import express from 'express';
const router = express.Router();
import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import SitiosxCativeiros from '../Models/SitiosxCativeiros.js';  // Importando o modelo de associação
import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";

const upload = multer({ dest: "public/uploads" });

// Rota GET para /cativeiros
router.get("/cativeiros", Auth, function (req, res) {
  Cativeiros.findAll({
    include: {
      model: Tipos_camarao, // Relacionamento com o modelo Tipos_camarao
      as: 'camarao',        
      attributes: ['nome'], // puxando o nome do camarão para exibir ali na table da view cativeiros
    }
  })
  .then((cativeiros) => {
    res.render("cativeiros", { cativeiros: cativeiros });
  })
  .catch((error) => {
    console.error("Erro ao buscar cativeiros:", error);
    res.status(500).send("Erro ao buscar cativeiros.");
  });
});

// GET para formulário de criação de cativeiro
router.get("/cativeiros/new", Auth, function (req, res) {
  // Pegando os parâmetros da URL
  const tipoId = req.query.tipoId;
  const id_sitio = req.query.id_sitio;

  // Verificando se o id_sitio foi passado corretamente
  console.log("id_sitio recebido:", id_sitio); // Debug

  // Buscar todos os cativeiros (se necessário para a view)
  Cativeiros.findAll().then((cativeiros) => {
    res.render("tanquesNew", {
      cativeiros: cativeiros,
      tipoId: tipoId,    // Passando o valor de tipoId para a view
      id_sitio: id_sitio, // Passando o valor de id_sitio para a view
    });
  }).catch((error) => {
    console.error("Erro ao buscar cativeiros:", error);
    res.status(500).send("Erro ao buscar cativeiros.");
  });
});

// Rota de cadastro de cativeiros
router.post("/cativeiros/new", Auth, upload.single('file'), async (req, res) => {
  const { id_tipo_camarao, data_instalacao } = req.body;
  const id_sitio = req.session.user.id_sitio;  // Acessando o id_sitio armazenado na sessão

  // Verifica se o id_sitio está presente
  if (!id_sitio) {
    req.flash("error", "Sítio não encontrado. Certifique-se de cadastrar um sítio.");
    return res.redirect("/sitio");
  }

  // Criação do cativeiro
  try {
    const novoCativeiro = await Cativeiros.create({
      id_tipo_camarao: id_tipo_camarao,
      foto_cativeiro: req.file ? req.file.filename : null,
      data_instalacao: new Date(data_instalacao),
    });

    // Relaciona o cativeiro ao sítio
    await SitiosxCativeiros.create({
      id_sitio: id_sitio,  // Obtém o id_sitio da sessão
      id_cativeiro: novoCativeiro.id_cativeiro,
    });

    // Redireciona para a página de condições do cativeiro
    res.redirect(`/condicoes/new?id_tipo_camarao=${id_tipo_camarao}`);
  } catch (error) {
    console.log("Erro ao cadastrar cativeiro:", error);
    res.status(500).send("Erro ao cadastrar o cativeiro.");
  }
});

// Excluir cativeiro
router.get("/cativeiros/delete/:id_cativeiro", (req, res) => {
  const id = req.params.id_cativeiro;

  Cativeiros.destroy({
    where: {
      id_cativeiro: id,
    },
  })
  .then(() => {
    res.redirect("/cativeiros");
  })
  .catch((error) => {
    console.log("Erro ao excluir cativeiro:", error);
    res.status(500).send("Erro ao excluir cativeiro.");
  });
});

// Editar cativeiro
router.get("/cativeiros/edit/:id_cativeiro", (req, res) => {
  const id = req.params.id_cativeiro;
  Cativeiros.findByPk(id).then((cativeiro) => {
    if (!cativeiro) {
      return res.status(404).send("Cativeiro não encontrado");
    }

    // Formatar a data no backend
    const formattedDate = cativeiro.data_instalacao ? new Date(cativeiro.data_instalacao).toLocaleDateString('pt-BR') : null;
    cativeiro.data_instalacao = formattedDate;

    res.render("cativeiroEdit", {
      cativeiro: cativeiro,
    });
  }).catch((error) => {
    console.error("Erro ao buscar o cativeiro:", error);
    res.status(500).send("Erro ao buscar o cativeiro");
  });
});

// Atualizar cativeiro
router.post("/cativeiros/update", (req, res) => {
  const { id_cativeiro, id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria } = req.body;

  // Atualiza apenas os campos preenchidos
  const updateData = {
    id_tipo_camarao,
    data_instalacao,
    foto_cativeiro,
    temp_media_diaria: temp_media_diaria || null,
    ph_medio_diario: ph_medio_diario || null,
    amonia_media_diaria: amonia_media_diaria || null,
  };

  Cativeiros.update(updateData, {
    where: { id_cativeiro }
  })
  .then(() => {
    res.redirect("/cativeiros");
  })
  .catch((error) => {
    console.log("Erro ao atualizar cativeiro:", error);
    res.status(500).send("Erro ao atualizar cativeiro.");
  });
});

export default router;
