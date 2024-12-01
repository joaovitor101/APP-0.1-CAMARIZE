import express from 'express';
import Tipos_camarao from "../Models/Camarao.js";  
import { Op } from 'sequelize';

const router = express.Router();

// Rota para listar todos os tipos de camarão
router.get("/camaroes", (req, res) => {
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');

  Tipos_camarao.findAll()
    .then((camaroes) => {
      res.render("camaroes", {
        camaroes,
        successMessage,
        errorMessage
      });
    })
    .catch((error) => {
      console.log("Erro ao buscar tipos de camarão:", error);
      req.flash('error', 'Erro ao buscar tipos de camarão.');
      res.redirect('/camaroes');
    });
});

// Rota para buscar tipos de camarão por nome
router.get("/camaroes/search", (req, res) => {
  const searchTerm = req.query.term;

  console.log("Buscando tipos de camarão com o termo:", searchTerm); // Log de depuração

  Tipos_camarao.findAll({
    where: {
      nome: {
        [Op.like]: `${searchTerm}%`
      }
    }
  })
  .then(camarões => {
    res.json(camarões);
  })
  .catch((error) => {
    console.log("Erro ao buscar tipos de camarão:", error);
    res.status(500).send("Erro ao buscar tipos de camarão.");
  });
});

// Rota para cadastrar um novo tipo de camarão
router.post("/camaroes/new", (req, res) => {
  const { nome } = req.body;

  console.log("Nome do camarão para criar:", nome); // Log para verificar o nome

  Tipos_camarao.findOne({ where: { nome } })
    .then(existingCamarao => {
      if (existingCamarao) {
        console.log("Camarão já existente. Redirecionando para criação de cativeiro.");
        // Se o tipo de camarão já existir, redireciona para a criação do cativeiro
        res.redirect(`/cativeiros/new?tipoId=${existingCamarao.id_tipo_camarao}`);
      } else {
        Tipos_camarao.create({ nome })
          .then(newCamarao => {
            console.log("Novo camarão criado:", newCamarao); // Log do novo camarão criado
            res.redirect(`/cativeiros/new?tipoId=${newCamarao.id_tipo_camarao}`);
          })
          .catch((error) => {
            console.log("Erro ao criar camarão:", error);
            req.flash('error', 'Erro ao criar tipo de camarão.');
            res.redirect('/camaroes');
          });
      }
    })
    .catch((error) => {
      console.log("Erro ao verificar duplicidade:", error);
      req.flash('error', 'Erro ao verificar duplicidade.');
      res.redirect('/camaroes');
    });
});

// Rota para atualizar um tipo de camarão
router.post("/camaroes/update", (req, res) => {
  const { id_tipo_camarao, nome } = req.body;

  Tipos_camarao.update(
    { nome },
    { where: { id_tipo_camarao } }
  )
  .then(() => {
    req.flash('success', 'Tipo de camarão atualizado com sucesso.');
    res.redirect("/camaroes");
  })
  .catch((error) => {
    console.log("Erro ao atualizar camarão:", error);
    req.flash('error', 'Erro ao atualizar tipo de camarão.');
    res.redirect('/camaroes');
  });
});

export default router;
