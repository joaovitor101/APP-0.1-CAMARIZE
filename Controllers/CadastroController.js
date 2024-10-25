import { Router } from 'express';

const router = Router();

// Rota para processar o primeiro formulário
router.post('/cadastro', (req, res) => {
    // Verifica se req.session está disponível
    if (!req.session) {
        return res.status(500).send('Sessão não inicializada corretamente.');
    }

    // Armazena os dados do primeiro formulário na sessão
    req.session.dadosParte1 = {
        nome: req.body.nome,  // Pega o valor do campo "nome"
        email: req.body.email // Pega o valor do campo "email"
    };
    
    // Redireciona para o segundo formulário
    res.redirect('/fazenda');
});

export default router;
