import express from 'express';
import Tipos_camarao from "../Models/Camarao.js";  
import Cativeiros from "../Models/Cativeiro.js";
import { Op } from 'sequelize';


const router = express.Router();

//rota listar
router.get("/camaroes", (req, res) => {
  // Pegue as mensagens flash
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');

  // Busque todos os tipos de camarões
  Tipos_camarao.findAll()
    .then((camaroes) => {
      // Renderize a página 'camaroes' passando as mensagens e a lista de camarões
      res.render("camaroes", {
        camaroes: camaroes,
        successMessage: successMessage, // Mensagem de sucesso, se houver
        errorMessage: errorMessage, // Mensagem de erro, se houver
      });
    })
    .catch((error) => {
      console.log("Erro ao buscar tipos de camarão:", error);
      req.flash('error', 'Erro ao buscar tipos de camarão.'); // Mensagem de erro
      res.redirect('/camaroes'); // Redireciona de volta para a lista de camarões
    });
});

//rota de buscar
router.get("/camaroes/search", (req, res) => {
  const searchTerm = req.query.term; // Pegue o texto digitado pelo usuário

  // Busque tipos de camarão que começam com o termo digitado
  Tipos_camarao.findAll({
    where: {
      nome: {
        [Op.like]: `${searchTerm}%` // Filtra os tipos que começam com o termo
      }
    }
  })
  .then(camarões => {
    res.json(camarões); // Retorna os resultados como JSON
  })
  .catch((error) => {
    console.log("Erro ao buscar tipos de camarão:", error);
    res.status(500).send("Erro ao buscar tipos de camarão.");
  });
});


// Rota para cadastrar um novo tipo de camarão
router.post("/camaroes/new", (req, res) => {
  const { nome } = req.body;  // O nome do camarão vindo do formulário

  // Verifica se o tipo de camarão já existe
  Tipos_camarao.findOne({
    where: { nome } // Verifica se já existe um camarão com o nome fornecido
  })
  .then(existingCamarao => {
    if (existingCamarao) {
      // Se já existe, pega o ID do tipo de camarão existente
      const tipoId = existingCamarao.id_tipo_camarao;
      // Redireciona para o cadastro de cativeiro, passando o ID do tipo de camarão
      res.redirect(`/cativeiros/new?tipoId=${tipoId}`);
    } else {
      // Caso não exista, cria o novo tipo de camarão
      Tipos_camarao.create({ nome })
        .then(newCamarao => {
          // Após criar, pega o ID do tipo de camarão recém-criado
          const tipoId = newCamarao.id_tipo_camarao;
          // Redireciona para o cadastro de cativeiro, passando o ID do tipo de camarão
          res.redirect(`/cativeiros/new?tipoId=${tipoId}`);
        })
        .catch((error) => {
          console.log("Erro ao criar camarão:", error);
          res.status(500).send("Erro ao criar tipo de camarão.");
        });
    }
  })
  .catch((error) => {
    console.log("Erro ao verificar duplicidade:", error);
    res.status(500).send("Erro ao verificar duplicidade.");
  });
});


// Rota para excluir um tipo de camarão
router.get("/camaroes/delete/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.destroy({
    where: { id_tipo_camarao: id }
  }).then(() => {
    res.redirect("/camaroes");
  }).catch((error) => {
    console.log("Erro ao excluir camarão:", error);
    res.status(500).send("Erro ao excluir camarão.");
  });
});

// Rota para editar um tipo de camarão
router.get("/camaroes/edit/:id_tipo_camarao", (req, res) => {
  const id = req.params.id_tipo_camarao;

  Tipos_camarao.findByPk(id).then((camarao) => {
    res.render("camaraoEdit", {  // Certifique-se que a view se chama "camaraoEdit.ejs" ou equivalente
      camarao: camarao
    });
  }).catch((error) => {
    console.log("Erro ao buscar camarão para edição:", error);
    res.status(500).send("Erro ao buscar camarão para edição.");
  });
});

// Rota para atualizar um tipo de camarão
router.post("/camaroes/update", (req, res) => {
  const { id_tipo_camarao, nome } = req.body;

  Tipos_camarao.update(
    { nome },
    { where: { id_tipo_camarao } }
  ).then(() => {
    res.redirect("/camaroes");
  }).catch((error) => {
    console.log("Erro ao atualizar camarão:", error);
    res.status(500).send("Erro ao atualizar camarão.");
  });
});

export default router;