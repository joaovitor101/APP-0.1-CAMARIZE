import express from 'express';
const router = express.Router();
import Tanque from '../models/Tanque.js';
import multer from 'multer';
import path from 'path'
import Auth from "../middleware/Auth.js";


const upload = multer({dest: "public/uploads"})


router.post("/tanques", Auth, function (req, res) {
  // Lógica para processar dados, se necessário.
  res.redirect('/tanques'); // Redirecionar para a rota GET
});


// Rota GET para /tanques
router.get("/tanques", Auth, function (req, res) {
    Tanque.findAll().then((tanques) => {
      res.render("tanques", {
        tanques: tanques,
      });
    });
  });
// Rota GET para exibir o formulário de criação de um novo tanque

router.get("/tanques/new", Auth, function (req, res) {
  Tanque.findAll().then((tanques) => {
    res.render("tanquesNew", {
      tanques: tanques,
    });
  });
});

  router.post("/tanques/new", Auth, upload.single('file'),(req, res) => {
    const codigo = req.body.codigo;
    const foto_cativeiro = req.file ? req.file.filename : null;
    const data_instalacao = req.body.data;
    const temp_media_diaria = req.body.temp;
    const ph_medio_diario = req.body.ph;
    const amonia_media_diaria = req.body.amonia
    const fileExtension = path.extname(req.file.originalname);  // Ex: ".jpg", ".png"
    const fileName = req.file.filename;  // Nome único do arquivo 

      
    console.log('Arquivo:', req.file);
    console.log('Extensão do arquivo:', fileExtension);
    Tanque.create({
      codigo:codigo,
      foto_cativeiro: foto_cativeiro,
      data_instalacao: data_instalacao,
      temp_media_diaria: temp_media_diaria,
      ph_medio_diario: ph_medio_diario,
      amonia_media_diaria: amonia_media_diaria,
    }).then(() => {
      res.redirect("/tanques");
    }).catch((error) => {
      console.log(error);
      res.status(500).send("Erro ao cadastrar o Tanque.");
    });
  });


  router.get("/tanques/delete/:id", (req, res) => {
    const id = req.params.id;
  
    Tanque.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        res.redirect("/tanques");
      })
      .catch((error) => {
        console.log(error);
      });
  });


  router.get("/tanques/edit/:id", (req, res) => {
    const id = req.params.id;
    Tanque.findByPk(id).then((tanque) => {
        if (!tanque) {
            return res.status(404).send("Tanque não encontrado");
        }

        // Formatar a data no backend
        const formattedDate = tanque.data ? new Date(tanque.data).toLocaleDateString('pt-BR') : null;
        tanque.data = formattedDate;

        res.render("tanqueEdit", {
            tanque: tanque,
        });
    }).catch((error) => {
        console.error("Erro ao buscar o tanque:", error);
        res.status(500).send("Erro ao buscar o tanque");
    });
});

router.post("/tanques/update", (req, res) => {
  const id = req.body.id;
  const nome = req.body.nome;
  const local = req.body.local;
  const data = req.body.data;

  Tanque.update(
    {
      nome: nome,
      local : local,
      data: data,
    },
    { where: { id: id } }
  )
    .then(() => {
      res.redirect("/tanques");
    })
    .catch((error) => {
      console.log(error);
    });
});

// Rota POST para /tanques (se necessário)

export default router;
