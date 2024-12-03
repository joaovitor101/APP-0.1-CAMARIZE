import express from 'express';
import Sensores from "../Models/Sensor.js"; 
import Tipos_sensor from "../Models/Tipos_sensor.js"; 
import flash from 'connect-flash';
import multer from 'multer';
import Auth from "../middleware/Auth.js";
const router = express.Router();

const upload = multer({ dest: 'public/uploads/' });

//listar os sensores
router.get("/sensores", async (req, res) => {
  try {
    const sensores = await Sensores.findAll({
      include: {
        model: Tipos_sensor, // Relacionamento com o modelo Tipos_camarao
        as: 'tipo_sensor',        // Nome da associação (usado no 'belongsTo')
        attributes: ['descricao'], // Campos que você quer trazer da tabela 'Tipos_camarao'
      }
    });

    const sensoresSimple = sensores.map(sensor => sensor.get({ plain: true }));

    // Ordenar os sensores por ID de forma decrescente
    const sensoresOrdenados = sensoresSimple.sort((a, b) => b.id_sensor - a.id_sensor);

    // Obter o parâmetro de destaque
    const highlight = req.query.highlight;

    res.render("sensores", {
      successMessage: req.flash("success"),
      errorMessage: req.flash("error"),
      sensores: sensoresOrdenados,  //dados p view
      highlight: highlight,  // Passando o ID do sensor a ser destacado
    });
  } catch (error) {
    console.log("Erro ao buscar sensores:", error);
    res.redirect("/sensores/new");
  }
});

//formulário de cadastro de sensor
router.get("/sensores/new", (req, res) => {
  res.render("sensorNew", {
    successMessage: req.flash("success"),
    errorMessage: req.flash("error"),
  });
});

// Cadastro de sensores
router.post("/sensores/new", Auth, upload.single('foto_sensor'), (req, res) => {
  const { id_tipo_sensor, apelido } = req.body; 

  // Verificações
  if (!id_tipo_sensor || !apelido) {
    return res.status(400).send("Erro: Dados obrigatórios não foram preenchidos.");
  }

  // Criar o sensor
  Sensores.create({
    id_tipo_sensor,
    apelido,
    foto_sensor: req.file ? req.file.filename : null,  // Usando req.file para salvar o arquivo
  })
  .then((sensor) => {
    req.flash("success", "Sensor cadastrado com sucesso!");
    res.redirect(`/sensores?highlight=${sensor.id_sensor}`);  
  })
  .catch((error) => {
    console.log("Erro ao cadastrar sensor:", error);
    res.status(500).send("Erro ao cadastrar o sensor.");
  });
});

// Rota para excluir um sensor
router.get("/sensores/delete/:id_sensor", (req, res) => {
  const id = req.params.id_sensor;

  Sensores.destroy({
    where: { id_sensor: id }
  }).then(() => {
    res.redirect("/sensores");
  }).catch((error) => {
    console.log("Erro ao excluir sensor:", error);
    res.status(500).send("Erro ao excluir sensor.");
  });
});

// Rota para editar sensor
router.get("/sensores/edit/:id_sensor", (req, res) => {
  const id = req.params.id_sensor;

  Sensores.findByPk(id).then((sensor) => {
    res.render("sensorEdit", {  
      sensor: sensor
    });
  }).catch((error) => {
    console.log("Erro ao buscar sensor para edição:", error);
    res.status(500).send("Erro ao buscar sensor para edição.");
  });
});

// Rota para atualizar sensor
router.post("/sensores/update", (req, res) => {
  const { id_sensor, id_tipo_sensor, apelido, foto_sensor } = req.body;

  Sensores.update(
    { id_tipo_sensor, apelido, foto_sensor },
    { where: { id_sensor } }
  ).then(() => {
    res.redirect("/sensores");
  }).catch((error) => {
    console.log("Erro ao atualizar sensor:", error);
    res.status(500).send("Erro ao atualizar sensor.");
  });
});

export default router;
