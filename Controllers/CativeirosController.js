import express from 'express';
import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";

import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import SitiosxCativeiros from '../Models/SitiosxCativeiros.js'; // Modelo de associação

const router = express.Router();
const upload = multer({ dest: "public/uploads" }); // Configuração básica para upload

// Rota para listar cativeiros
router.get("/cativeiros", Auth, (req, res) => {
  Cativeiros.findAll({
    include: {
      model: Tipos_camarao,
      as: 'camarao',
      attributes: ['nome'], // Exibir nome do camarão
    }
  })
    .then((cativeiros) => {
      res.render("cativeiros", { cativeiros });
    })
    .catch((error) => {
      console.error("Erro ao buscar cativeiros:", error);
      res.status(500).send("Erro ao buscar cativeiros.");
    });
});

// Rota para exibir formulário de criação de cativeiros
router.get("/cativeiros/new", Auth, (req, res) => {
  const { tipoId, id_sitio } = req.query;

  Cativeiros.findAll()
    .then((cativeiros) => {
      res.render("tanquesNew", {
        cativeiros,
        tipoId,
        id_sitio,
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar cativeiros:", error);
      res.status(500).send("Erro ao buscar cativeiros.");
    });
});

// Rota para cadastrar um novo cativeiro
router.post("/cativeiros/new", Auth, upload.single('file'), async (req, res) => {
  const { id_tipo_camarao, data_instalacao } = req.body;
  console.log("id_tipo_camarao recebido:", id_tipo_camarao); // Verifique aqui

  const id_sitio = req.session.user?.id_sitio; 

  if (!id_sitio) {
    req.flash("error", "Sítio não encontrado. Certifique-se de cadastrar um sítio.");
    return res.redirect("/sitio");
  }

  try {
    const novoCativeiro = await Cativeiros.create({
      id_tipo_camarao,
      foto_cativeiro: req.file ? req.file.filename : null,
      data_instalacao: new Date(data_instalacao),
    });

    await SitiosxCativeiros.create({
      id_sitio,
      id_cativeiro: novoCativeiro.id_cativeiro,
    });

    res.redirect(`/condicoes/new?id_tipo_camarao=${id_tipo_camarao}`);
  } catch (error) {
    console.error("Erro ao cadastrar cativeiro:", error);
    res.status(500).send("Erro ao cadastrar o cativeiro.");
  }
});


// Rota para excluir um cativeiro
router.get("/cativeiros/delete/:id_cativeiro", Auth, (req, res) => {
  const { id_cativeiro } = req.params;

  Cativeiros.destroy({ where: { id_cativeiro } })
    .then(() => {
      req.flash('success', 'Cativeiro excluído com sucesso.');
      res.redirect("/cativeiros");
    })
    .catch((error) => {
      console.error("Erro ao excluir cativeiro:", error);
      res.status(500).send("Erro ao excluir cativeiro.");
    });
});

// Rota para exibir formulário de edição de cativeiro
router.get("/cativeiros/edit/:id_cativeiro", Auth, (req, res) => {
  const { id_cativeiro } = req.params;

  Cativeiros.findByPk(id_cativeiro)
    .then((cativeiro) => {
      if (!cativeiro) {
        return res.status(404).send("Cativeiro não encontrado");
      }

      const formattedDate = cativeiro.data_instalacao
        ? new Date(cativeiro.data_instalacao).toLocaleDateString('pt-BR')
        : null;

      cativeiro.data_instalacao = formattedDate;

      res.render("cativeiroEdit", { cativeiro });
    })
    .catch((error) => {
      console.error("Erro ao buscar o cativeiro:", error);
      res.status(500).send("Erro ao buscar o cativeiro.");
    });
});

// Rota para atualizar um cativeiro
router.post("/cativeiros/update", Auth, (req, res) => {
  const { id_cativeiro, id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria } = req.body;

  const updateData = {
    id_tipo_camarao,
    data_instalacao: data_instalacao ? new Date(data_instalacao) : null,
    foto_cativeiro,
  };

  Cativeiros.update(updateData, { where: { id_cativeiro } })
    .then(() => {
      req.flash('success', 'Cativeiro atualizado com sucesso.');
      res.redirect("/cativeiros");
    })
    .catch((error) => {
      console.error("Erro ao atualizar cativeiro:", error);
      res.status(500).send("Erro ao atualizar cativeiro.");
    });
});

export default router;
