import express from 'express';
const router = express.Router();
import Auth from "../middleware/Auth.js";
router.post('/fazenda', (req, res) => {
    const dadosParte1 = req.session.dadosParte1;
    const senha = req.body.senha;

    // Verifica se os dados do primeiro formulário estão presentes
    if (!dadosParte1) {
        return res.redirect('/cadastro'); // Se não, redireciona para o primeiro formulário
    }

    // Tenta salvar os dados no banco de dados
    Login.create({
        nome: dadosParte1.nome,
        email: dadosParte1.email,
        senha: dadosParte1.senha
    }).then(() => {
        // Limpa os dados da sessão após salvar
        req.session.dadosParte1 = null;
        res.redirect('/tanques');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('Erro ao cadastrar');
    });
});

export default router