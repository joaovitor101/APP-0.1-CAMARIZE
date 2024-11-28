import express from 'express';
import Sitios from '../Models/Sitio.js';  // Certifique-se de que este modelo está correto
import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import bcrypt from 'bcrypt';
import flash from 'connect-flash';
const router = express.Router();

// ROTA DE CADASTRO DE SÍTIO
router.get("/sitio", (req, res) => {
    const userId = req.query.id; //ID do usuário da URL

    // vai pro login
    if (!userId) {
        req.flash("error", "Usuário não autenticado.");
        return res.redirect("/login");
    }

    //formulário de cadastro de sítio, passando o id do usuario
    res.render("sitio", {
        success: req.flash('success'),
        error: req.flash('error'),
        userId: userId, // Passa o userId para a view
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

            // Armazenando id_sitio na sessão para que seja acessado em páginas subsequentes
            req.session.id_sitio = novoSitio.id_sitio;  // Aqui armazenamos o id_sitio na sessão

            req.flash("success", "Sítio cadastrado com sucesso!");
            res.redirect("/cativeiros"); // Redireciona para o cadastro de cativeiros
        }
    } catch (error) {
        console.log("Erro:", error);
        req.flash("error", "Erro ao cadastrar o sítio. Tente novamente.");
        res.redirect(`/sitio?id=${userId}`);
    }
});


export default router;
