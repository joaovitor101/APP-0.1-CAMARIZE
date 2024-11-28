import express from 'express';
import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";

import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import SitiosxCativeiros from '../Models/SitiosxCativeiros.js'; // Modelo de associação

const router = express.Router();

// Configuração do multer para upload simples
const upload = multer({ 
  dest: 'public/uploads' // Diretório para onde as fotos serão enviadas
});

// Rota para listar cativeiros
router.get("/cativeiros", Auth, (req, res) => {
  Cativeiros.findAll({
    include: {
      model: Tipos_camarao,
      as: 'camarao',
      attributes: ['nome'], // Exibir nome do camarão
    }
  })
    .then((cativeiros) => {
      res.render("cativeiros", { cativeiros });
    })
    .catch((error) => {
      console.error("Erro ao buscar cativeiros:", error);
      res.status(500).send("Erro ao buscar cativeiros.");
    });
});


// Rota para exibir formulário de criação de cativeiros
router.get("/cativeiros/new", Auth, (req, res) => {
  const { tipoId, id_sitio } = req.query;

  Cativeiros.findAll()
    .then((cativeiros) => {
      res.render("tanquesNew", {
        cativeiros,
        tipoId,
        id_sitio,
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar cativeiros:", error);
      res.status(500).send("Erro ao buscar cativeiros.");
    });
});

//cadastro de cativeiro e em seguida associcacao na entidade sitiosxcativeiros
router.post("/cativeiros/new", upload.single('foto_cativeiro'), async (req, res) => {
  const { id_tipo_camarao, data_instalacao } = req.body;
  const tipoId = id_tipo_camarao; // Obtém o tipo de camarão do campo oculto
  const foto_cativeiro = req.file ? req.file.path : null; // Caminho do arquivo da foto

  try {
    // Cria o cativeiro com o id_tipo_camarao
    const cativeiro = await Cativeiros.create({
      data_instalacao,
      foto_cativeiro: foto_cativeiro, // Salva o caminho da foto
      id_tipo_camarao: tipoId // Inclui o tipo de camarão aqui
    });

    // Associa o cativeiro ao sítio
    const id_sitio = req.session.sitioId; // Obtém o ID do sítio associado ao usuário logado
    
    await SitiosxCativeiros.create({
      id_sitio,
      id_cativeiro: cativeiro.id,
      id_tipo_camarao: tipoId // Assegura que o tipo de camarão também seja associado
    });

    req.flash('success', 'Cativeiro cadastrado e associado com sucesso!');
    res.redirect('/cativeiros'); // Redireciona para a lista de cativeiros

  } catch (error) {
    console.error("Erro ao cadastrar cativeiro:", error);
    req.flash('error', 'Erro ao cadastrar cativeiro.');
    res.redirect('/cativeiros/new');
  }
});

// Rota para exibir formulário de edição de cativeiro
router.get("/cativeiros/edit/:id_cativeiro", Auth, (req, res) => {
  const { id_cativeiro } = req.params;

  Cativeiros.findByPk(id_cativeiro)
    .then((cativeiro) => {
      if (!cativeiro) {
        return res.status(404).send("Cativeiro não encontrado");
      }

      const formattedDate = cativeiro.data_instalacao
        ? new Date(cativeiro.data_instalacao).toLocaleDateString('pt-BR')
        : null;

      cativeiro.data_instalacao = formattedDate;

      res.render("cativeiroEdit", { cativeiro });
    })
    .catch((error) => {
      console.error("Erro ao buscar o cativeiro:", error);
      res.status(500).send("Erro ao buscar o cativeiro.");
    });
});

// Rota para atualizar um cativeiro
router.post("/cativeiros/update", upload.single('foto_cativeiro'), Auth, async (req, res) => {
  const { id_cativeiro, id_tipo_camarao, data_instalacao, foto_cativeiro, temp_media_diaria, ph_medio_diario, amonia_media_diaria } = req.body;

  // Verificar se o id_cativeiro e id_tipo_camarao existem
  if (!id_cativeiro || !id_tipo_camarao) {
    req.flash('error', 'Dados incompletos para atualização.');
    return res.redirect(`/cativeiros/edit/${id_cativeiro}`);
  }

  // Se houver uma nova foto, use o caminho da nova foto, caso contrário, mantenha a foto existente
  const updateData = {
    id_tipo_camarao,
    data_instalacao: data_instalacao ? new Date(data_instalacao) : null,
    foto_cativeiro: req.file ? req.file.path : foto_cativeiro, // Usando o caminho da nova foto ou mantendo a antiga
  };

  try {
    // Atualiza o cativeiro
    await Cativeiros.update(updateData, { where: { id_cativeiro } });

    req.flash('success', 'Cativeiro atualizado com sucesso.');
    res.redirect("/cativeiros");
  } catch (error) {
    console.error("Erro ao atualizar cativeiro:", error);
    req.flash('error', 'Erro ao atualizar cativeiro.');
    res.redirect(`/cativeiros/edit/${id_cativeiro}`);
  }
});


// Rota para excluir um cativeiro
router.get("/cativeiros/delete/:id_cativeiro", Auth, async (req, res) => {
  const { id_cativeiro } = req.params;

  try {
    // Verificar se o cativeiro existe
    const cativeiro = await Cativeiros.findByPk(id_cativeiro);
    if (!cativeiro) {
      req.flash('error', 'Cativeiro não encontrado.');
      return res.redirect("/cativeiros");
    }

    // Excluir o cativeiro
    await Cativeiros.destroy({ where: { id_cativeiro } });

    req.flash('success', 'Cativeiro excluído com sucesso.');
    res.redirect("/cativeiros");
  } catch (error) {
    console.error("Erro ao excluir cativeiro:", error);
    req.flash('error', 'Erro ao excluir cativeiro.');
    res.status(500).send("Erro ao excluir cativeiro.");
  }
});

export default router;
