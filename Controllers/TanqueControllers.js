import express from 'express';
const router = express.Router();
import Tanque from '../models/Tanque.js';

router.post("/tanques", function (req, res) {
  // Lógica para processar dados, se necessário.
  res.redirect('/tanques'); // Redirecionar para a rota GET
});
// Rota GET para /tanques
router.get("/tanques", function (req, res) {
    Tanque.findAll().then((tanques) => {
      res.render("tanques", {
        tanques: tanques,
      });
    });
  });
// Rota GET para exibir o formulário de criação de um novo tanque

router.get("/tanques/new", function (req, res) {
  Tanque.findAll().then((tanques) => {
    res.render("tanquesNew", {
      tanques: tanques,
    });
  });
});

  router.post("/tanques/new", (req, res) => {
    const nome = req.body.nome;
    const local = req.body.local;
    const data = req.body.data;
  
    Tanque.create({
      nome: nome,
      local: local,
      data: data,
    }).then(() => {
      res.redirect("/tanques");
    }).catch((error) => {
      console.log(error);
      res.status(500).send("Erro ao cadastrar o Tanque.");
    });
  });


  router.get("/tanques/delete/:id", (req, res) => {
    const id = req.params.id;
  
    Tanque.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        res.redirect("/tanques");
      })
      .catch((error) => {
        console.log(error);
      });
  });


  router.get("/tanques/edit/:id", (req, res) => {
    const id = req.params.id;
    Tanque.findByPk(id).then((tanque) => {
        if (!tanque) {
            return res.status(404).send("Tanque não encontrado");
        }

        // Formatar a data no backend
        const formattedDate = tanque.data ? new Date(tanque.data).toLocaleDateString('pt-BR') : null;
        tanque.data = formattedDate;

        res.render("tanqueEdit", {
            tanque: tanque,
        });
    }).catch((error) => {
        console.error("Erro ao buscar o tanque:", error);
        res.status(500).send("Erro ao buscar o tanque");
    });
});

router.post("/tanques/update", (req, res) => {
  const id = req.body.id;
  const nome = req.body.nome;
  const local = req.body.local;
  const data = req.body.data;

  Tanque.update(
    {
      nome: nome,
      local : local,
      data: data,
    },
    { where: { id: id } }
  )
    .then(() => {
      res.redirect("/tanques");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Rota POST para /tanques (se necessário)

export default router;
