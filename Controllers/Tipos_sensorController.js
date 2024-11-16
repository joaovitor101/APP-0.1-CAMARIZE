import express from 'express';
import Tipos_sensor from "../Models/Tipos_sensor.js";  
import flash from 'connect-flash';
import { validationResult } from 'express-validator'
const router = express.Router();

// Rota principal para listar os tipos de sensor
router.get("/tipos_sensor", (req, res) => {
  // Buscar todos os tipos de sensor no banco de dados
  Tipos_sensor.findAll().then(tipos_sensor => {
    // Passar os dados para a view
    res.render("tipos_sensor", {
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      tipos_sensor: tipos_sensor // Passando os dados para a view
    });
  }).catch((error) => {
    console.log("Erro ao buscar tipos de sensor:", error);
    res.status(500).send("Erro ao buscar tipos de sensor.");
  });
});



export default router;