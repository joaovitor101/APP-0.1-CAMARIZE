import express from 'express';
const router = express.Router();
import Tanque from '../models/Tanque.js';

// Rota GET para /tanques
router.get("/tanques", function (req, res) {
    const tanques = [
        {local: "Ana Silva",  data: "12101020"},
        {local: "Pedro Almeida",  data: "20241012"},
        {local: "Marina Oliveira", data: "20241012"},
        {local: "Rafael Santos", data: "20241012"}
    ];
    res.render("tanques", {
        tanques: tanques,
    });
});

// Rota POST para /tanques (se necessário)
router.post("/tanques", function (req, res) {
    // Lógica para processar dados, se necessário.
    res.redirect('/tanques'); // Redirecionar para a rota GET
});

export default router;
