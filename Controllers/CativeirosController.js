import express from 'express';
const router = express.Router();

import Cativeiros from "../Models/Cativeiro.js";

import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";


const upload = multer({dest: "public/uploads"})




// Rota GET para /tanques
router.get("/cativeiros", Auth, function (req, res) {
    Cativeiros.findAll().then((cativeiros) => {
      res.render("cativeiros", {
        cativeiros: cativeiros,
      });
    });
  });
// Rota GET para exibir o formulário de criação de um novo tanque

router.get("/cativeiros/new", Auth, function (req, res) {
  const tipoId = req.query.tipoId;  // Captura o tipoId passado pela URL
  Cativeiros.findAll().then((cativeiros) => {
    res.render("tanquesNew", {
      cativeiros: cativeiros,
      tipoId: tipoId,  
    });
  });
});


// Cadastro de cativeiros
router.post("/cativeiros/new", Auth, upload.single('file'), (req, res) => {
  const { id_tipo_camarao, data } = req.body;  // Dados enviados no formulário

  //verificacoes
  console.log("ID Tipo de Camarão:", id_tipo_camarao);  
  console.log("Data de Instalação:", data);  

  //validacao
  if (!id_tipo_camarao || !data) {
    return res.status(400).send("Erro: Tipo de camarão e data de instalação são obrigatórios.");
  }

  const data_instalacao = new Date(data); // Converte a data para o formato adequado
  if (isNaN(data_instalacao)) {
    return res.status(400).send("Erro: Data inválida.");
  }

  // Criar o cativeiro
  Cativeiros.create({
    id_tipo_camarao: id_tipo_camarao,
    foto_cativeiro: req.file ? req.file.filename : null,
    data_instalacao: data_instalacao,
  })
  .then(() => {
    res.redirect("/condicoes/new");  // Redireciona após o cadastro
  })
  .catch((error) => {
    console.log("Erro ao cadastrar o cativeiro:", error);
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

        res.render("tanqueEdit", {
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
