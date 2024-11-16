import express from 'express';
import Sensores from "../Models/Sensor.js";  
import flash from 'connect-flash';
import { validationResult } from 'express-validator'
const router = express.Router();

// Rota principal para listar os tipos de sensor
router.get("/sensores", (req, res) => {
    // Buscar todos os tipos de sensor no banco de dados
    Sensores.findAll().then(sensores => {
      // Passar os dados para a view
      res.render("sensores", {
        successMessage: req.flash('success'),
        errorMessage: req.flash('error'),
        tipos_sensor: tipos_sensor // Passando os dados para a view
      });
    }).catch((error) => {
      console.log("Erro ao buscar sensores:", error);
      res.status(500).send("Erro ao buscar sensores.");
    });
  });
  

router.get("/tipos_sensor/new", async (req, res) => {
    try {
      // Buscar todos os tipos de sensor
      const sensores = await Sensores.findAll();
      const sensoresSimple = sensores.map(sensor => sensor.get({ plain: true }));
  
      // Ordenar os sensores por ID de forma decrescente usando mergeSort
      const sensoresOrdenados = mergeSort(sensoresSimple);
  
      // Renderizar a view com os dados
      res.render("sensorNew", {
        successMessage: req.flash("success"),
        errorMessage: req.flash("error"),
        tipos_sensor: sensores, // Passando os dados para a view
      });
    } catch (error) {
      console.log("Erro ao carregar a página de cadastro de sensores:", error);
      res.status(500).send("Erro ao carregar a página de cadastro de sensores.");
    }
  });

  export default router;