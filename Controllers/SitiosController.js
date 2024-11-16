import express from 'express';
import Sitios from '../Models/Sitio.js';  // Certifique-se de que este modelo está correto
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator'; // Para facilitar a validação, caso você queira
import flash from 'connect-flash';
const router = express.Router();

router.get("/sitio", (req, res) => {
  // Passa as mensagens de flash para o EJS
  res.render("sitio", {
      success: req.flash('success'),
      error: req.flash('error')
  });
});

router.get("/meuSitio", (req, res) => {
    // Passa as mensagens de flash para o EJS
    res.render("meuSitio", {
        success: req.flash('success'),
        error: req.flash('error')
    });
  });

router.post("/createSitio", async (req, res) => {
    const { nome, rua, bairro, cidade, numero } = req.body;
    try {
        // Verifique se já existe uma sitio com o nome informado
        const sitioExistente = await Sitios.findOne({
            where: {
                nome: nome,
            },
        });

        if (sitioExistente) {
            // Se a sitio já existe, mostre um erro
            req.flash("error", "O nome da sitio já existe. Escolha outro nome.");
            return res.redirect("/sitio");  // Redireciona de volta para a página de cadastro
        } else {
            // Crie a nova sitio
            const novasitio = await Sitios.create({
                nome: nome,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                numero: numero,
            });

            // Se criada com sucesso, redirecione para a página desejada
            req.flash("success", "sitio cadastrada com sucesso!");
            return res.redirect("/cativeiros");  // Redireciona para uma página de sucesso
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Ocorreu um erro ao tentar cadastrar a sitio. Tente novamente.");
        return res.redirect("/sitio");  // Redireciona para a página de cadastro caso haja erro
    }
});

export default router;
