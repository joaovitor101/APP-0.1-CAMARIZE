import express from 'express';
const router = express.Router();

import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import SitiosxCativeiros from '../Models/SitiosxCativeiros.js';  // Importando o modelo de associação
import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";

const upload = multer({ dest: "public/uploads" });

// Rota GET para /cativeiros
router.get("/cativeiros", Auth, function (req, res) {
  Cativeiros.findAll({
    include: {
      model: Tipos_camarao, // Relacionamento com o modelo Tipos_camarao
      as: 'camarao',        
      attributes: ['nome'], // puxando o nome do camarao para exibir ali na table da view cativeiros
    }
  })
  .then((cativeiros) => {
    res.render("cativeiros", { cativeiros: cativeiros });
  })
  .catch((error) => {
    console.error("Erro ao buscar cativeiros:", error);
    res.status(500).send("Erro ao buscar cativeiros.");
  });
});

// Rota GET para exibir o formulário de criação de um novo tanque
router.get("/cativeiros/new", Auth, function (req, res) {
  //pegando da url
  const tipoId = req.query.tipoId;
  const id_sitio = req.query.id_sitio;

  // Verificando se id_sitio está sendo passado corretamente
  console.log("id_sitio recebido:", id_sitio); // Debug

  Cativeiros.findAll().then((cativeiros) => {
    res.render("tanquesNew", {
      cativeiros: cativeiros,
      tipoId: tipoId,
      id_sitio: id_sitio,  // Passando o valor de id_sitio para a view
    });
  }).catch(error => {
    console.error("Erro ao buscar cativeiros:", error);
    res.status(500).send("Erro ao buscar cativeiros.");
  });
});

// Cadastro de cativeiros
router.post("/cativeiros/new", Auth, upload.single('file'), (req, res) => {
  const { id_tipo_camarao, data, id_sitio } = req.body;  // Dados enviados no formulário

  // Verificações
  console.log("ID Tipo de Camarão:", id_tipo_camarao);
  console.log("Data de Instalação:", data);
  console.log("ID do Sítio:", id_sitio);  // Verificando o id_sitio

  // Validação
  if (!id_tipo_camarao || !data || !id_sitio) {
    return res.status(400).send("Erro: Tipo de camarão, data de instalação e sítio são obrigatórios.");
  }

  const data_instalacao = new Date(data);
  if (isNaN(data_instalacao)) {
    return res.status(400).send("Erro: Data inválida.");
  }

  // Criar o cativeiro
  Cativeiros.create({
    id_tipo_camarao: id_tipo_camarao,
    foto_cativeiro: req.file ? req.file.filename : null,
    data_instalacao: data_instalacao,
  })
  .then((novoCativeiro) => {
    // assim que o cativeiro é criado, tambem é associado ao seu sitio, assim comecara um melhor controle para que cada usuario possa visualizar os cativeirps pertencentes aos seus sitios apenas
    return SitiosxCativeiros.create({
      id_sitio: id_sitio,  // Id do sítio associado
      id_cativeiro: novoCativeiro.id_cativeiro  // Id do novo cativeiro criado
    });
  })
  .then(() => {
    res.redirect(`/condicoes/new?id_tipo_camarao=${id_tipo_camarao}`);  // Redireciona após o cadastro
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
    const formattedDate = cativeiro.data_instalacao ? new Date(cativeiro.data_instalacao).toLocaleDateString('pt-BR') : null;
    cativeiro.data_instalacao = formattedDate;

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
