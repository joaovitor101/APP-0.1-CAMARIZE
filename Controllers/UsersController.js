import express from "express";
import Usuarios from "../Models/Usuario.js";
import bcrypt from "bcrypt";
import UsuariosxSitios from "../Models/UsuarioxSitio.js"; 
import Sitios from "../Models/Sitio.js"
import flash from "connect-flash";
const router = express.Router();

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
        // Verifica se já existe um usuário com esse e-mail
        const userExists = await Usuarios.findOne({
            where: { email: email }
        });

        if (userExists === null) {
            // Criação do usuário
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(senha, salt);

            try {
                const novo = await Usuarios.create({
                    email: email,
                    senha: hash,
                });

                // redirecionando pra cadastro de sitio
                req.flash("success", "Usuário registrado com sucesso! Registre seu sítio.");
                res.redirect(`/sitio?id=${novo.id_user}`); // passando o id do usuario
            } catch (error) {
                console.log(error);
                req.flash("error", "Erro ao criar usuário. Tente novamente!");
                res.redirect("/register");
            }
        } else {
            req.flash("error", "O usuário informado já existe. Faça o login!");
            res.redirect("/register");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao verificar dados do usuário. Tente novamente!");
        res.redirect("/register");
    }
});



// ROTA DE LOGIN
router.post("/authenticate", async (req, res) => {
    const { email, senha } = req.body;
    try {
        // Buscar o usuário pelo e-mail
        const user = await Usuarios.findOne({
            where: { email: email }
        });

        // Se o usuário for encontrado
        if (user != null) {
            // Verificar a senha
            const correct = bcrypt.compareSync(senha, user.senha);

            if (correct) {
                // BUSCA DO ID DO SITIO NA ENTIDADE ASSOCIATIVA USUARIOSXSITIOS
                const usuarioSitio = await UsuariosxSitios.findOne({
                    where: { id_user: user.id_user },  // Certifique-se de que está usando a coluna correta
                    include: [{
                        model: Sitios,  // Associe o modelo Sitios
                        as: 'Sitio',    // Alias correto (deve ser 'Sitio' com 'S' maiúsculo)
                        attributes: ['id_sitio']  // Pegue apenas o id_sitio
                    }]
                });
                
                console.log(usuarioSitio);  // Adicionando log para depurar                

                // Se o usuário tem um sítio associado
                if (usuarioSitio && usuarioSitio.Sitio) {  // Usando 'Sitio' com 'S' maiúsculo
                    // Armazenar as informações do usuário e o id_sitio na sessão
                    req.session.user = {
                        id: user.id_user,
                        email: user.email,
                        id_sitio: usuarioSitio.Sitio.id_sitio // Armazenar o id_sitio na sessão
                    };

                    req.flash("success", `Bem-vindo, ${user.email}!`);
                    res.redirect("/cativeiros");  // Redireciona para a página de cativeiros ou qualquer outra página desejada
                } else {
                    req.flash("error", "Você não está associado a nenhum sítio. Cadastre um sítio.");
                    res.redirect("/sitio");  // Redireciona para a página de cadastro de sítio
                }
            } else {
                req.flash("error", "A senha informada está incorreta. Tente novamente!");
                res.redirect("/login");
            }
        } else {
            req.flash("error", "O usuário informado não existe. Tente novamente!");
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao autenticar. Tente novamente!");
        res.redirect("/login");
    }
});


// ROTA DE LOGOUT
router.get("/logout", (req, res) => {
    req.session.user = undefined; // Limpa a sessão do usuário
    req.flash("success", "Logout efetuado com sucesso!");
    res.redirect("/"); // Redireciona para a página inicial
});

// ROTA DE PERFIL (Mostra o perfil do usuário logado)
router.get("/perfil", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para acessar o perfil.");
            return res.redirect("/login");
        }

        res.render("perfil", {
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
            user: req.session.user, // Passa as informações do usuário para o perfil
        });
    } catch (error) {
        console.log(error);
    }
});

export default router;
