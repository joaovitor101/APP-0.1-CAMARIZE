import express from 'express';
const router = express.Router();
import Login from '../Models/Login.js';
// Rota para processar o primeiro formulário

router.get("/cadastro", function (req, res) {
    // Lógica para processar dados, se necessário.
    res.render("cadastro"); // Redirecionar para a rota GET
  });


//   router.get("/cadastro", function (req, res) {
//     Login.findAll().then((clientes) => {
//       res.render("cadastro", {
//         clientes: clientes,
//       });
//     });
//   });

  router.post("/cadastro/new", (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    Login.create({
      nome: nome,
      senha: senha,
      email: email,
    }).then(() => {
      res.redirect("/cadastroFazenda");
    });
  });


export default router;
