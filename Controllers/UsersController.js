import express from "express";
import Usuarios from "../Models/Usuario.js";
import bcrypt from "bcrypt";
import UsuariosxSitios from "../Models/UsuarioxSitio.js";
import Sitios from "../Models/Sitio.js";
import Auth from "../middleware/Auth.js";
import multer from 'multer';
import path from 'path';
// Configuração simples do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');  // Diretório onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);  // Nome único para evitar sobrescrições
    }
});

const upload = multer({ storage });  // Middleware do multer
const router = express.Router();
// FORM DE LOGIN
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
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(senha, salt);

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
        // Verifique se o usuário já está logado
        if (req.session.user) {
            req.flash("error", "Você já está logado.");
            return res.redirect("/cativeiros");
        }

        // Validar campos
        if (!email || !senha) {
            req.flash("error", "Por favor, preencha todos os campos.");
            return res.redirect("/login");
        }

        // Buscar o usuário pelo e-mail
        const user = await Usuarios.findOne({
            where: { email: email }
        });

        // Se o usuário for encontrado
        if (user) {
            // Verificar a senha
            const correct = await bcrypt.compare(senha, user.senha);

            if (correct) {
                // BUSCA DO ID DO SITIO NA ENTIDADE ASSOCIATIVA USUARIOSXSITIOS
                const usuarioSitio = await UsuariosxSitios.findOne({
                    where: { id_user: user.id_user },
                    include: [{
                        model: Sitios,
                        as: 'Sitio', // Usando o alias da associação
                        attributes: ['id_sitio'] // Apenas o id do sítio
                    }]
                });

                console.log(usuarioSitio);  // Adicionando log para depurar

                // Se o usuário tem um sítio associado
                if (usuarioSitio && usuarioSitio.Sitio) {
                    req.session.user = {
                        id: user.id_user,
                        email: user.email,
                        id_sitio: usuarioSitio.Sitio.id_sitio
                    };

                    req.flash("success", `Bem-vindo, ${user.email}!`);
                    res.redirect("/cativeiros");
                } else {
                    req.flash("error", "Você não está associado a nenhum sítio. Cadastre um sítio.");
                    res.redirect("/sitio");
                }
            } else {
                req.flash("error", "E-mail ou senha incorretos. Tente novamente.");
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

// ROTA DE PERFIL
router.get("/perfil", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para acessar o perfil.");
            return res.redirect("/login");
        }

        const user = await Usuarios.findByPk(req.session.user.id);  // Pega os dados do usuário logado

        res.render("perfil", {
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
            user  // Passa o usuário para a view
        });
    } catch (error) {
        console.log(error);
    }
});

// Rota edição de perfil
router.get("/perfil/edit", Auth, async (req, res) => {
    try {
        const user = await Usuarios.findByPk(req.user.id);  

        if (!user) {
            return res.redirect("/perfil");  
        }

        res.render("perfilEdit", {
            user  
        });
    } catch (error) {
        console.error("Erro ao carregar dados de perfil:", error);
        res.redirect("/perfil");  
    }
});


// Rota de atualização do perfil
router.post("/perfil/update", Auth, upload.single('foto_perfil'), async (req, res) => {
    const { nome, email, senha } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;  // Se houver um arquivo, pega o nome do arquivo

    try {
        const user = await Usuarios.findByPk(req.user.id);
        if (!user) {
            req.flash("error", "Usuário não encontrado.");
            return res.redirect("/perfil");
        }

        user.nome = nome || user.nome;  // Atualiza o nome se for fornecido
        user.email = email || user.email;  // Atualiza o e-mail se for fornecido

        // Se a senha for fornecida, atualiza a senha
        if (senha) {
            user.senha = bcrypt.hashSync(senha, 10); 
        }

        // Se a foto de perfil for enviada, atualiza o campo foto_perfil
        if (foto_perfil) {
            user.foto_perfil = foto_perfil;
        }

        await user.save();  // Salva as alterações no banco de dados
        req.flash("success", "Perfil atualizado com sucesso!");
        res.redirect("/perfil");  // Redireciona para a página de perfil
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        req.flash("error", "Erro ao atualizar o perfil.");
        res.redirect("/perfil/edit");
    }
});
  
// ROTA DE MEU SÍTIO 
router.get("/meuSitio", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para acessar os dados do sítio.");
            return res.redirect("/login");
        }

        // Buscar o sítio associado ao usuário logado
        const usuarioSitio = await UsuariosxSitios.findOne({
            where: { id_user: req.session.user.id },
            include: [ {
                model: Sitios,
                as: 'Sitio',
                attributes: ['id_sitio', 'nome', 'rua', 'bairro', 'cidade', 'numero'] 
            }]
        });

        if (usuarioSitio && usuarioSitio.Sitio) {
            res.render("meuSitio", {
                user: req.session.user,
                sitio: usuarioSitio.Sitio, 
                successMessage: req.flash("success"),
                errorMessage: req.flash("error")
            });
        } else {
            req.flash("error", "Você não está associado a nenhum sítio.");
            res.redirect("/sitio"); 
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar os dados do sítio.");
        res.redirect("/perfil"); 
    }
});


export default router;
