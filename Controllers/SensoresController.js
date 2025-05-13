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

router.get('/uploads/:id_sensor', async (req, res) => {
  try {
    const sensor = await Sensores.findByPk(req.params.id_sensor);

    if (!sensor || !sensor.foto_sensor) {
      return res.status(404).send('Imagem não encontrada');
    }

    res.setHeader('Content-Type', 'image/jpeg'); // ou 'image/png' dependendo do tipo
    res.send(sensor.foto_sensor);
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    res.status(500).send('Erro ao buscar imagem');
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

router.post("/sensores/update", upload.single("foto_sensor"), async (req, res) => {
  const { id_sensor, id_tipo_sensor, apelido } = req.body;
  const foto_sensor = req.file ? req.file.buffer : null;

  try {
    console.log("Foto enviada:", req.file ? "Sim" : "Não");

    // Se nenhuma nova imagem foi enviada, mantém a antiga
    const sensorExistente = await Sensores.findByPk(Number(id_sensor));

    await Sensores.update({
      id_tipo_sensor,
      apelido,
      foto_sensor: foto_sensor || sensorExistente.foto_sensor,
    }, {
      where: { id_sensor: Number(id_sensor) }
    });

    res.redirect("/sensores");
  } catch (error) {
    console.error("Erro ao atualizar sensor:", error);
    res.status(500).send("Erro ao atualizar sensor.");
  }
});


export default router;
