import express from "express";
const router = express.Router();
import Auth from "../middleware/Auth.js";
// Importando o model de Cliente

import Login from "../Models/Login.js";


// ROTA DE CADASTRO DE CLIENTES

router.post("/login/new", (req, res) => {
  const nome = req.body.nome;
  const cpf = req.body.cpf;
  const endereco = req.body.endereco;
  Cliente.create({
    nome: nome,
    cpf: cpf,
    endereco: endereco,
  }).then(() => {
    res.redirect("/login");
  });
});

router.get("/login/delete/:id", (req, res) => {
  const id = req.params.id;

  Login.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/login/edit/:id", (req, res) => {
  const id = req.params.id;
  Login.findByPk(id).then((cliente) => {
    res.render("clienteEdit", {
      cliente: cliente,
    });
  });
});

router.post("/login/update", (req, res) => {
  const id = req.body.id;
  const nome = req.body.nome;
  const cpf = req.body.cpf;
  const endereco = req.body.endereco;

  Login.update(
    {
      nome: nome,
      cpf: cpf,
      endereco: endereco,
    },
    { where: { id: id } }
  )
    .then(() => {
      res.redirect("/clientes");
    })
    .catch((error) => {
      console.log(error);
    });
});
export default router;