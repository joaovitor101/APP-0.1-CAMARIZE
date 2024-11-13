import express from 'express';
import Tipos_camarao from "../Models/Camarao.js";  

const router = express.Router();

// Rota principal para listar os tipos de camarões
router.get("/camaroes", (req, res) => {
  Tipos_camarao.findAll().then((camaroes) => {
    res.render("camaroes", {
      camaroes: camaroes,
    });
  }).catch((error) => {
    console.log("Erro ao buscar tipos de camarão:", error);
    res.status(500).send("Erro ao buscar tipos de camarão.");
  });
});

// Rota para cadastrar um novo tipo de camarão
router.post("/camaroes/new", (req, res) => {
  const { nome } = req.body;  // O 'id_tipo_camarao' é auto-incrementado, não precisa ser passado

  Tipos_camarao.create({
    nome
  }).then(() => {
    res.redirect("/camaroes");
  }).catch((error) => {
    console.log("Erro ao criar camarão:", error);
    res.status(500).send("Erro ao criar camarão.");
  });
});

// Rota para excluir um tipo de camarão
router.get("/camaroes/delete/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.destroy({
    where: { id_tipo_camarao: id }
  }).then(() => {
    res.redirect("/camaroes");
  }).catch((error) => {
    console.log("Erro ao excluir camarão:", error);
    res.status(500).send("Erro ao excluir camarão.");
  });
});

// Rota para editar um tipo de camarão
router.get("/camaroes/edit/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.findByPk(id).then((camarao) => {
    res.render("camaraoEdit", {  // Certifique-se que a view se chama "camaraoEdit.ejs" ou equivalente
      camarao: camarao
    });
  }).catch((error) => {
    console.log("Erro ao buscar camarão para edição:", error);
    res.status(500).send("Erro ao buscar camarão para edição.");
  });
});

// Rota para atualizar um tipo de camarão
router.post("/camaroes/update", (req, res) => {
  const { id_tipo_camarao, nome } = req.body;

  Tipos_camarao.update(
    { nome },
    { where: { id_tipo_camarao } }
  ).then(() => {
    res.redirect("/camaroes");
  }).catch((error) => {
    console.log("Erro ao atualizar camarão:", error);
    res.status(500).send("Erro ao atualizar camarão.");
  });
});

export default router;