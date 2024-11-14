import express from 'express';
import Fazenda from '../Models/Fazenda.js';  // Certifique-se de que este modelo está correto
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator'; // Para facilitar a validação, caso você queira
import flash from 'connect-flash';
const router = express.Router();

router.get("/fazenda", (req, res) => {
  // Passa as mensagens de flash para o EJS
  res.render("fazenda", {
      success: req.flash('success'),
      error: req.flash('error')
  });
});

router.post("/createFazenda", async (req, res) => {
    const { nome, rua, bairro, cidade, numero } = req.body;
    try {
        // Verifique se já existe uma fazenda com o nome informado
        const fazendaExistente = await Fazenda.findOne({
            where: {
                nome: nome,
            },
        });

        if (fazendaExistente) {
            // Se a fazenda já existe, mostre um erro
            req.flash("error", "O nome da fazenda já existe. Escolha outro nome.");
            return res.redirect("/fazenda");  // Redireciona de volta para a página de cadastro
        } else {
            // Crie a nova fazenda
            const novaFazenda = await Fazenda.create({
                nome: nome,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                numero: numero,
            });

            // Se criada com sucesso, redirecione para a página desejada
            req.flash("success", "Fazenda cadastrada com sucesso!");
            return res.redirect("/cativeiros");  // Redireciona para uma página de sucesso
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Ocorreu um erro ao tentar cadastrar a fazenda. Tente novamente.");
        return res.redirect("/fazenda");  // Redireciona para a página de cadastro caso haja erro
    }
});

export default router;
