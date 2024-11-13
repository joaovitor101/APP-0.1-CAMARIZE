import express from "express";
const router = express.Router();
import User from "../Models/User.js";
import bcrypt from "bcrypt";

// ROTA DE LOGIN
router.get("/login", async (req, res) => {
	try {
		res.render("login", {
			errorMessage: req.flash("error"),
			successMessage: req.flash("success"),
			loggedOut: true,
			username: req.session.username
		});
	} catch (error) {
		console.log(error);
	}
});

// ROTA DE LOGOUT
router.get("/logout", (req, res) => {
	req.session.user = undefined;
	req.flash("success", "Logout efetuado com sucesso!");
	res.redirect("/");
});

// ROTA DE REGISTRO
router.get("/register", async (req, res) => {
	try {
		res.render("register", {
			successMessage: req.flash("success"),
			errorMessage: req.flash("error"),
			loggedOut: true,
		});
	} catch (error) {
		console.log(error);
	}
});

// ROTA DE CRIAÇÃO DE USUÁRIO
router.post("/createUser", async (req, res) => {
	const { email, senha } = req.body;
	try {
		const buscaUm = await User.findOne({
			where: {
				email: email,
			},
		});
		if (buscaUm == undefined) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(senha, salt);
			try {
				const novo = await User.create({
					email: email,
					senha: hash,
				});
				if (novo) {
					res.redirect("/fazenda");
				}
			} catch (error) {
				console.log(error);
			}
			// caso o usuário já es teja cadastrado
		} else {
			req.flash("error", "O usuário informado já existe. Faça o login!");
			res.redirect("/register");
		}
	} catch {}
});

// ROTA DE AUTENTICAÇÃO
router.post("/authenticate", async (req, res) => {
	const {email, senha } = req.body;
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
				
				req.flash("success", `Bem-vindo, ${user}!`);
				res.redirect("/tanques");
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

export default router;