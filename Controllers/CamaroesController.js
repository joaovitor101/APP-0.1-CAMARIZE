import express from 'express';
import Tipos_camarao from "../Models/Camarao.js";  
import Cativeiros from "../Models/Cativeiro.js";
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

  Tipos_camarao.findOne({ where: { nome } })
    .then(existingCamarao => {
      if (existingCamarao) {
        res.redirect(`/cativeiros/new?tipoId=${existingCamarao.id_tipo_camarao}`);
      } else {
        Tipos_camarao.create({ nome })
          .then(newCamarao => {
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

// Rota para excluir um tipo de camarão
router.get("/camaroes/delete/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.destroy({
    where: { id_tipo_camarao: id }
  })
  .then(() => {
    req.flash('success', 'Tipo de camarão excluído com sucesso.');
    res.redirect("/camaroes");
  })
  .catch((error) => {
    console.log("Erro ao excluir camarão:", error);
    req.flash('error', 'Erro ao excluir tipo de camarão.');
    res.redirect("/camaroes");
  });
});

// Rota para exibir formulário de edição de um tipo de camarão
router.get("/camaroes/edit/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.findByPk(id)
    .then((camarao) => {
      res.render("camaraoEdit", { 
        camarao
      });
    })
    .catch((error) => {
      console.log("Erro ao buscar camarão para edição:", error);
      req.flash('error', 'Erro ao buscar camarão para edição.');
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
