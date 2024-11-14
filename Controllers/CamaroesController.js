import express from 'express';
import Tipos_camarao from "../Models/Camarao.js";  
import flash from 'connect-flash';
import { validationResult } from 'express-validator'
import { Op } from 'sequelize'; 
const router = express.Router();


// Rota principal para listar os tipos de camarões
router.get("/camaroes", async (req, res) => {
  try {
    // Busca os tipos de camarão no banco de dados
    const tipos_camarao = await Tipos_camarao.findAll();  // Usando Sequelize para buscar todos os tipos de camarão

    // Passa os dados para o EJS, incluindo a lista de tipos de camarão
    res.render("camaroes", {
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      tipos_camarao: tipos_camarao  // Passa os tipos de camarão para o template
    });
  } catch (error) {
    console.error("Erro ao carregar tipos de camarão:", error);
    req.flash('error', 'Erro ao carregar tipos de camarão');
    res.redirect('/');
  }
});

// Rota para busca de tipos de camarão
router.get('/search', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    // Se o parâmetro 'query' não for enviado, retorna erro
    return res.status(400).json({ error: "Parâmetro 'query' é obrigatório" });
  }

  try {
    // Filtra os tipos de camarão baseado no que o usuário digitou
    const tipos = await Tipos_camarao.findAll({
      where: {
        nome: {
          [Op.like]: `%${query}%`  // Realiza a busca no campo 'nome' com LIKE
        }
      }
    });

    // Se não houver tipos encontrados, retorna um array vazio
    if (tipos.length === 0) {
      return res.json([]); // Retorna um array vazio se não encontrar resultados
    }

    // Retorna os nomes dos tipos encontrados
    res.json(tipos.map(tipo => tipo.nome));
  } catch (error) {
    console.log("Erro na busca:", error);
    res.status(500).json({ error: "Erro ao buscar os tipos de camarão" });
  }
});


// Rota para cadastrar um novo tipo de camarão
router.post("/camaroes/new", async (req, res) => {
  const { nome } = req.body;

  try {
    // Verifica se o tipo de camarão já existe
    const existingTipo = await Tipos_camarao.findOne({ where: { nome } });
    
    if (existingTipo) {
      // Se já existir, redireciona para a lista de tipos
      return res.redirect("/camaroes");
    }

    // Caso contrário, cria um novo tipo
    await Tipos_camarao.create({ nome });

    res.redirect("/camaroes");
  } catch (error) {
    console.log("Erro ao criar camarão:", error);
    res.status(500).send("Erro ao criar camarão.");
  }
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