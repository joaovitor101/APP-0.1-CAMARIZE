import express from 'express';
import Sitios from '../Models/Sitio.js';  // Certifique-se de que este modelo está correto
import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import bcrypt from 'bcrypt';
import flash from 'connect-flash';
const router = express.Router();

// ROTA DE CADASTRO DE SÍTIO
// ROTA DE CADASTRO DE SÍTIO
router.get("/sitio", (req, res) => {
    const userId = req.query.id; // Captura o ID do usuário da URL

    // Se o ID do usuário não for encontrado, redireciona para o login
    if (!userId) {
        req.flash("error", "Usuário não autenticado.");
        return res.redirect("/login");
    }

    // Renderiza o formulário de cadastro de sítio, passando o ID do usuário
    res.render("sitio", {
        success: req.flash('success'),
        error: req.flash('error'),
        userId: userId, // Passa o userId para a view
    });
});


// ROTA DE CRIAÇÃO DE SÍTIO
router.post("/createSitio", async (req, res) => {
    const { nome, rua, bairro, cidade, numero } = req.body;
    const userId = req.body.id_user; // Corrigido para id_user

    console.log("Dados recebidos:", { nome, rua, bairro, cidade, numero, userId }); // Para ver os dados que estão sendo enviados

    try {
        // Verifique se já existe um sítio com o nome informado
        const sitioExistente = await Sitios.findOne({
            where: { nome: nome }
        });

        console.log("Sítio já existente:", sitioExistente);

        if (sitioExistente) {
            req.flash("error", "O nome do sítio já existe. Escolha outro nome.");
            return res.redirect(`/sitio?id=${userId}`);  // Redireciona para a página de cadastro de sítio
        } else {
            const novositio = await Sitios.create({
                nome: nome,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                numero: numero
            });

            console.log("Novo ID do sítio:", novositio.get('id_sitio')); 

            // Associe o usuário ao sítio
            await UsuariosxSitios.create({
                id_user: userId, // Usa o ID do usuário
                id_sitio: novositio.id_sitio  
            });

            req.flash("success", "Sítio cadastrado com sucesso!");
            return res.redirect("/cativeiros");  // Redireciona para a página de cativeiros ou outra que você preferir
        }
    } catch (error) {
        console.log("Erro:", error); // Exibe o erro para facilitar a identificação
        req.flash("error", "Ocorreu um erro ao tentar cadastrar o sítio. Tente novamente.");
        return res.redirect(`/sitio?id=${userId}`);  // Redireciona de volta com erro
    }
});



export default router;
