import express from 'express';
import Sitios from '../Models/Sitio.js';
import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import flash from 'connect-flash';
import multer from "multer";
import path from "path";
import Auth from "../middleware/Auth.js";

// Configuração do multer para upload de fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Diretório onde a foto será armazenada
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

const router = express.Router();

// ROTA DE CADASTRO DE SÍTIO
router.get("/sitio", (req, res) => {
    const userId = req.query.id; // ID do usuário da URL

    if (!userId) {
        req.flash("error", "Usuário não autenticado.");
        return res.redirect("/login");
    }

    res.render("sitio", {
        success: req.flash('success'),
        error: req.flash('error'),
        userId: userId,
    });
});

// ROTA DE CRIAÇÃO DE SÍTIO (POST)
router.post("/createSitio", async (req, res) => {
    const { nome, rua, bairro, cidade, numero } = req.body;
    const userId = req.body.id_user;

    try {
        const sitioExistente = await Sitios.findOne({ where: { nome: nome } });

        if (sitioExistente) {
            req.flash("error", "O nome do sítio já existe. Escolha outro nome.");
            return res.redirect(`/sitio?id=${userId}`);
        } else {
            const novoSitio = await Sitios.create({
                nome: nome,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                numero: numero
            });

            // Associe o usuário ao sítio
            await UsuariosxSitios.create({
                id_user: userId,
                id_sitio: novoSitio.id_sitio
            });

            req.session.id_sitio = novoSitio.id_sitio; // Armazenar o id_sitio na sessão
            req.flash("success", "Sítio cadastrado com sucesso!");
            res.redirect("/cativeiros"); // Redireciona para o cadastro de cativeiros
        }
    } catch (error) {
        console.log("Erro:", error);
        req.flash("error", "Erro ao cadastrar o sítio. Tente novamente.");
        res.redirect(`/sitio?id=${userId}`);
    }
});

// ROTA DE MEU SÍTIO
router.get("/meuSitio", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para acessar os dados do sítio.");
            return res.redirect("/login");
        }

        const usuarioSitio = await UsuariosxSitios.findOne({
            where: { id_user: req.session.user.id },
            include: [{
                model: Sitios,
                as: 'Sitio',
                attributes: ['id_sitio', 'nome', 'rua', 'bairro', 'cidade', 'numero', 'foto_sitio']
            }]
        });

        if (usuarioSitio && usuarioSitio.Sitio) {
            const fotoSitio = usuarioSitio.Sitio.foto_sitio || 'imgs/criacao-e-cultivo-de-camarao.jpg';

            res.render("meuSitio", {
                user: req.session.user,
                sitio: usuarioSitio.Sitio,
                fotoSitio,
                successMessage: req.flash("success"),
                errorMessage: req.flash("error")
            });
        } else {
            req.flash("error", "Você não está associado a nenhum sítio.");
            res.redirect("/sitio"); // Caso não tenha um sítio associado
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar os dados do sítio.");
        res.redirect("/perfil");
    }
});

// Rota para editar o sítio (exibição do formulário)
router.get("/meuSitio/edit", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para editar o sítio.");
            return res.redirect("/login");
        }

        const usuarioSitio = await UsuariosxSitios.findOne({
            where: { id_user: req.session.user.id },
            include: [{
                model: Sitios,
                as: 'Sitio',
                attributes: ['id_sitio', 'nome', 'foto_sitio']
            }]
        });

        if (usuarioSitio && usuarioSitio.Sitio) {
            res.render("meusitioEdit", { sitio: usuarioSitio.Sitio });
        } else {
            req.flash("error", "Você não tem um sítio associado.");
            res.redirect("/meuSitio");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar dados do sítio.");
        res.redirect("/perfil");
    }
});

// Rota para atualizar dados do sítio, incluindo foto
router.post("/meuSitio/update", upload.single('foto_sitio'), async (req, res) => {
    const { nome, rua, bairro, cidade, numero } = req.body;
    const foto_sitio = req.file ? req.file.filename : null;

    try {
        const usuarioSitio = await UsuariosxSitios.findOne({
            where: { id_user: req.session.user.id },
            include: [{
                model: Sitios,
                as: 'Sitio',
                attributes: ['id_sitio']
            }]
        });

        if (!usuarioSitio || !usuarioSitio.Sitio) {
            req.flash("error", "Sítio não encontrado.");
            return res.redirect("/meuSitio");
        }

        const sitio = usuarioSitio.Sitio;
        sitio.nome = nome || sitio.nome;
        sitio.rua = rua || sitio.rua;
        sitio.bairro = bairro || sitio.bairro;
        sitio.cidade = cidade || sitio.cidade;
        sitio.numero = numero || sitio.numero;

        if (foto_sitio) {
            sitio.foto_sitio = foto_sitio;
        }

        await sitio.save();
        req.flash("success", "Sítio atualizado com sucesso!");
        res.redirect("/meuSitio");
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao atualizar o sítio.");
        res.redirect("/meuSitio/edit");
    }
});

export default router;
