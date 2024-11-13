import express from 'express';
const router = express.Router();

import Cativeiros from "../Models/Cativeiro.js";

import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";


const upload = multer({dest: "public/uploads"})


// Rota GET para /tanques
router.get("/cativeiros", Auth, function (req, res) {
    Tanque.findAll().then((cativeiros) => {
      res.render("cativeiros", {
        cativeiros: cativeiros,
      });
    });
  });
// Rota GET para exibir o formulário de criação de um novo tanque

router.get("/cativeiros/new", Auth, function (req, res) {
  Tanque.findAll().then((cativeiros) => {
    res.render("cativeirosNew", {
      cativeiros: cativeiros,
    });
  });
});


// Cadastro de cativeiros
router.post("/cativeiros/new", Auth, upload.single('file'),(req, res) => {
    const id_tipo_camarao = req.body.id_tipo_camarao;
    const data_instalacao = req.body.data;
    const foto_cativeiro = req.file ? req.file.filename : null;
    const fileExtension = path.extname(req.file.originalname);  // Ex: ".jpg", ".png"
    const fileName = req.file.filename;  // Nome único do arquivo 

      
    console.log('Arquivo:', req.file);
    console.log('Extensão do arquivo:', fileExtension);
    Cativeiros.create({
      id_tipo_camarao:id_tipo_camarao,
      foto_cativeiro: foto_cativeiro,
      data_instalacao: data_instalacao,

    }).then(() => {
      res.redirect("/cativeiros");
    }).catch((error) => {
      console.log(error);
      res.status(500).send("Erro ao cadastrar o cativeiro.");
    });
  });



// Excluir cativeiro
router.get("/cativeiros/delete/:id_cativeiro", (req, res) => {
    const id = req.params.id_cativeiro;

    Cativeiros.destroy({
        where: {
            id_cativeiro: id,
        },
    })
    .then(() => {
        res.redirect("/cativeiros");
    })
    .catch((error) => {
        console.log("Erro ao excluir cativeiro:", error);
        res.status(500).send("Erro ao excluir cativeiro.");
    });
});

// Editar cativeiro
router.get("/cativeiros/edit/:id_cativeiro", (req, res) => {
    const id = req.params.id_cativeiro;
    Cativeiros.findByPk(id).then((cativeiro) => {
        if (!cativeiro) {
            return res.status(404).send("Tanque não encontrado");
        }

        // Formatar a data no backend
        const formattedDate = cativeiro.data ? new Date(cativeiro.data).toLocaleDateString('pt-BR') : null;
        cativeiro.data = formattedDate;

        res.render("cativeiroEdit", {
            cativeiro: cativeiro,
        });
    }).catch((error) => {
        console.error("Erro ao buscar o cativeiro:", error);
        res.status(500).send("Erro ao buscar o cativeiro");
    });
});


// Atualizar cativeiro
router.post("/cativeiros/update", (req, res) => {
    const { id_cativeiro, id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria } = req.body;

    Cativeiros.update(
      { id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria },
      { where: { id_cativeiro } }
    )
    .then(() => {
        res.redirect("/cativeiros");
    })
    .catch((error) => {
        console.log("Erro ao atualizar cativeiro:", error);
        res.status(500).send("Erro ao atualizar cativeiro.");
    });
});

export default router;
