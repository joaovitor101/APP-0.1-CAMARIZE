import express from "express";
const router = express.Router();

// Importando o model de Cliente

import Login from "../Models/Login.js";

// ROTA CLIENTES
router.get("/login", function (req, res) {
  Login.findAll().then((clientes) => {
    res.render("login", {
      clientes: clientes,
    });
  });
});


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

  router.post("/authenticate", async (req, res) => {
	const { email, senha } = req.body;
	try {
		const user = await User.findOne({
			where: {
				email: email,
			},
		});
		if (user != undefined) {
			// compara a senha
			const correct = bcrypt.compareSync(senha, user.senha);
			// se estiver correta então...
			if (correct) {
				req.session.user = {
					id: user.id,
					email: user.email,
				};
				// res.send(`Usuário logado:<br>
				// 	ID: ${req.session.user["id"]}<br>
				// 	E-mail: ${req.session.user["email"]}`);
				// ENVIAR UMA MENSAGEM DE SUCESSO
				req.flash("success", "Login efetuado com sucesso!");
				res.redirect("/");
			} else {
				req.flash(
					"error",
					"A senha informada está incorreta. Tente novamente!"
				);
				res.redirect("/login");
			}
		} else {
			req.flash(
				"error",
				"O usuário informado não existe. Tente novamente!"
			);
			res.redirect("/login");
		}
	} catch (error) {
		console.log(error);
	}
});
export default router