import express from 'express';
import Tipos_sensor from "../Models/Tipos_sensor.js";  
import flash from 'connect-flash';
import { validationResult } from 'express-validator'
const router = express.Router();


// Rota principal para listar os tipos de sensor
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


// Rota para cadastrar um novo tipo de sensor
router.post("/tipos_sensor/new", (req, res) => {
  const { descricao } = req.body;  
  Tipos_sensor.create({
    descricao
  }).then(() => {
    res.redirect("/cativeiros");
  }).catch((error) => {
    console.log("Erro ao criar sensor:", error);
    res.status(500).send("Erro ao criar sensor.");
  });
});

// Rota para excluir um tipo de sensor
router.get("/tipos_sensor/delete/:id_tipo_sensor", (req, res) => {
  const id = req.params.id_tipo_sensor;

  Tipos_sensor.destroy({
    where: { id_tipo_sensor: id }
  }).then(() => {
    res.redirect("/tipos_sensor");
  }).catch((error) => {
    console.log("Erro ao excluir sensor:", error);
    res.status(500).send("Erro ao excluir sensor.");
  });
});

// Rota para atualizar um tipo de sensor
router.post("/tipos_sensor/update", (req, res) => {
  const { id_tipo_sensor, nome } = req.body;

  Tipos_sensor.update(
    { descricao },
    { where: { id_tipo_sensor } }
  ).then(() => {
    res.redirect("/tipos_sensor");
  }).catch((error) => {
    console.log("Erro ao atualizar sensor:", error);
    res.status(500).send("Erro ao atualizar sensor.");
  });
});

export default router;