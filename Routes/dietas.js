import express from "express";
import DietasController from "../Controllers/DietasController.js";

const router = express.Router();

router.get("/dietas", DietasController.listar);
router.get("/dietas/new", DietasController.exibirFormulario);
router.post("/dietas/new", DietasController.criar);
router.get("/dieta_atual", DietasController.buscarDietaAtual);
router.put('/dietas/:id', DietasController.atualizarDieta);

export default router;
