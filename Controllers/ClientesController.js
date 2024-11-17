import express from "express";
const router = express.Router();
import Auth from "../middleware/Auth.js";
// Importando o model de Cliente
import Cliente from "../Models/Login.js";  // Certifique-se de que está importando o modelo correto

// ROTA DE CADASTRO DE CLIENTES
// ROTA DE CADASTRO DE CLIENTES
router.post("/clientes/new", (req, res) => {
  const { nome, email, senha, foto_perfil } = req.body;

  Cliente.create({
    nome: nome,
    email: email,
    senha: senha,
    foto_perfil: foto_perfil, // Caso o campo seja fornecido
  })
    .then((cliente) => {
      // Após criar o cliente, redireciona para o cadastro de sítio, passando o ID do cliente
      res.redirect(`/sitio?id=${cliente.id}`);
    })
    .catch((error) => {
      console.log("Erro ao criar cliente:", error);
      res.status(500).send("Erro ao criar cliente.");
    });
});

// Rota para excluir cliente
router.get("/clientes/delete/:id", (req, res) => {
  const id = req.params.id;

  Cliente.destroy({
    where: {
      id: id,
    },
  })
    .then(() => {
      res.redirect("/clientes");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Erro ao excluir cliente.");
    });
});

// Rota para editar cliente
router.get("/clientes/edit/:id", (req, res) => {
  const id = req.params.id;
  Cliente.findByPk(id).then((cliente) => {
    res.render("clienteEdit", {
      cliente: cliente,
    });
  });
});

// Rota para atualizar cliente
router.post("/clientes/update", (req, res) => {
  const { id, nome, email, senha, foto_perfil } = req.body;

  Cliente.update(
    {
      nome: nome,
      email: email,
      senha: senha,
      foto_perfil: foto_perfil,  // Atualiza o campo foto_perfil, caso seja enviado
    },
    { where: { id: id } }
  )
    .then(() => {
      res.redirect("/clientes");
    })
    .catch((error) => {
      console.log("Erro ao atualizar cliente:", error);
      res.status(500).send("Erro ao atualizar cliente.");
    });
});

export default router;
