import express from 'express';
import Dietas from "../Models/Dieta.js";  

const router = express.Router();

// Rota principal para listar dietas
router.get("/dietas", (req, res) => {
  Dietas.findAll().then((dietas) => {
    res.render("dietas", {
      dietas: dietas,
    });
  }).catch((error) => {
    console.log("Erro ao buscar dieta:", error);
    res.status(500).send("Erro ao buscar dieta.");
  });
});

// Rota para cadastrar dieta
router.post("/dietas/new", (req, res) => {
  const { descricao } = req.body;  

  Dietas.create({
    descricao
  }).then(() => {
    res.redirect("/dietas");
  }).catch((error) => {
    console.log("Erro ao criar dieta:", error);
    res.status(500).send("Erro ao criar dieta.");
  });
});

// Rota para excluir dieta
router.get("/dietas/delete/:id_dieta", (req, res) => {
  const id = req.params.id_dieta;

  Dietas.destroy({
    where: { id_dieta: id }
  }).then(() => {
    res.redirect("/dietas");
  }).catch((error) => {
    console.log("Erro ao excluir dieta:", error);
    res.status(500).send("Erro ao excluir dieta.");
  });
});

// Rota para editar dieta
router.get("/dietas/edit/:id_dieta", (req, res) => {
  const id = req.params.id_dieta;

  Dietas.findByPk(id).then((dieta) => {
    res.render("dietaEdit", {  
        dieta: dieta
    });
  }).catch((error) => {
    console.log("Erro ao buscar dieta para edição:", error);
    res.status(500).send("Erro ao buscar dieta para edição.");
  });
});

// Rota para atualizar dieta
router.post("/dietas/update", (req, res) => {
  const { id_dieta, descricao } = req.body;

  Dietas.update(
    { descricao },
    { where: { id_dieta } }
  ).then(() => {
    res.redirect("/dietas");
  }).catch((error) => {
    console.log("Erro ao atualizar dieta:", error);
    res.status(500).send("Erro ao atualizar dieta.");
  });
});

export default router;