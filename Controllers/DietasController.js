import express from 'express';
import Dietas from "../Models/Dieta.js";  
import Especif_camarao from "../Models/Especif_camarao.js";
import Condicoes_ideais from "../Models/Condicao_ideal.js"; // Certifique-se de importar o modelo de Condições Ideais

const router = express.Router();

// Rota principal para listar dietas
router.get("/dietas", (req, res) => {
  Dietas.findAll().then((dietas) => {
    res.render("dietas", {
      dietas: dietas,
    });
  }).catch((error) => {
    console.log("Erro ao buscar dieta:", error);
    res.status(500).send("Erro ao buscar dieta.");
  });
});

// Rota para exibir o formulário de dietas
router.get("/dietas/new", (req, res) => {
  const { id_tipo_camarao } = req.query; // Captura o id_tipo_camarao da query string

  if (!id_tipo_camarao) {
    return res.status(400).send("ID do tipo de camarão não fornecido.");
  }

  // Renderiza a página de dietas passando o id_tipo_camarao
  res.render("dietas", { id_tipo_camarao });
});


// Cadastro de dieta e criação de registros na tabela Especif_camarao
router.post("/dietas/new", (req, res) => {
  const { descricao, id_tipo_camarao } = req.body;

  // Verificar se o id_tipo_camarao foi passado corretamente
  if (!id_tipo_camarao) {
    return res.status(400).send("ID do tipo de camarão não foi fornecido.");
  }

  // Cria a dieta sem associar diretamente o id_tipo_camarao
  Dietas.create({ descricao })
    .then(async (novaDieta) => {
      try {
        // Agora buscamos as condições ideais para o tipo de camarão
        const condicoes = await Condicoes_ideais.findAll({ where: { id_tipo_camarao } });

        // Verifica se foram encontradas condições ideais
        if (condicoes.length === 0) {
          return res.status(404).send("Nenhuma condição ideal encontrada para este tipo de camarão.");
        }

        // Após encontrar as condições ideais, criamos os registros na tabela Especif_camarao
        for (const condicao of condicoes) {
          await Especif_camarao.create({
            id_tipo_camarao,   // Passa o id_tipo_camarao
            id_dieta: novaDieta.id_dieta,
            id_condicao: condicao.id_condicao,
          });
        }

        res.redirect('/cativeiros');
      } catch (error) {
        console.error('Erro ao realizar cadastro automático:', error);
        res.status(500).send('Erro ao realizar cadastro automático.');
      }
    })
    .catch((error) => {
      console.log('Erro ao criar dieta:', error);
      res.status(500).send('Erro ao criar dieta.');
    });
});

export default router;
