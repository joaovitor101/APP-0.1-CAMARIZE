import express from 'express';
const router = express.Router();

import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import Sitios from '../Models/Sitio.js'

import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";


const upload = multer({dest: "public/uploads"})



//INICIAL LEVANDO A LISTAGEM DE CATIVEIROS DO SITIO
router.get("/cativeiros", Auth, async (req, res) => {
  try {
      // Verifica o usuário logado na sessão
      const userId = req.session.user.id;

      // Encontra o sítio associado ao usuário
      const sitioAssociado = await UsuariosxSitios.findOne({
          where: { id_user: userId },
          include: {
              model: Sitios, // Certifique-se de que o modelo Sitios está associado
              as: 'sitio'
          }
      });

      if (!sitioAssociado) {
          req.flash("error", "Nenhum sítio associado ao usuário.");
          return res.redirect("/sitio"); // Redireciona para criar um sítio
      }

      // Busca os cativeiros associados ao sítio do usuário
      const cativeiros = await Cativeiros.findAll({
          where: { id_sitio: sitioAssociado.id_sitio },
          include: {
              model: Tipos_camarao,
              as: 'camarao',
              attributes: ['nome'] // Ajuste o atributo de acordo com seu modelo
          }
      });

      // Renderiza a página de cativeiros
      res.render("cativeiros", {
          cativeiros: cativeiros,
          sitio: sitioAssociado.sitio // Passa o sítio associado, se necessário
      });
  } catch (error) {
      console.error("Erro ao buscar cativeiros:", error);
      res.status(500).send("Erro ao buscar cativeiros.");
  }
});



// Cadastro de cativeiros
router.post("/cativeiros/new", Auth, upload.single('file'), (req, res) => {
  const { id_tipo_camarao, data } = req.body;  // Dados enviados no formulário

  //verificacoes
  console.log("ID Tipo de Camarão:", id_tipo_camarao);  
  console.log("Data de Instalação:", data);  

  //validacao
  if (!id_tipo_camarao || !data) {
    return res.status(400).send("Erro: Tipo de camarão e data de instalação são obrigatórios.");
  }

  const data_instalacao = new Date(data); // Converte a data para o formato adequado
  if (isNaN(data_instalacao)) {
    return res.status(400).send("Erro: Data inválida.");
  }

  // Criar o cativeiro
  Cativeiros.create({
    id_tipo_camarao: id_tipo_camarao,
    foto_cativeiro: req.file ? req.file.filename : null,
    data_instalacao: data_instalacao,
  })
  .then(() => {
    res.redirect(`/condicoes/new?id_tipo_camarao=${id_tipo_camarao}`);  // Redireciona após o cadastro
  })
  .catch((error) => {
    console.log("Erro ao cadastrar o cativeiro:", error);
    res.status(500).send("Erro ao cadastrar o cativeiro.");
  });
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
          return res.status(404).send("Tanque não encontrado");
      }

      // Formatar a data no backend
      const formattedDate = cativeiro.data ? new Date(cativeiro.data).toLocaleDateString('pt-BR') : null;
      cativeiro.data = formattedDate;

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

    Cativeiros.update(
      { id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria },
      { where: { id_cativeiro } }
    )
    .then(() => {
        res.redirect("/cativeiros");
    })
    .catch((error) => {
        console.log("Erro ao atualizar cativeiro:", error);
        res.status(500).send("Erro ao atualizar cativeiro.");
    });
});

export default router;
