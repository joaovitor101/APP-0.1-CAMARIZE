import express from 'express';
import multer from 'multer';
import path from 'path';
import Auth from "../middleware/Auth.js";

import UsuariosxSitios from '../Models/UsuarioxSitio.js';
import Sitios from "../Models/Sitio.js";
import Cativeiros from "../Models/Cativeiro.js";
import Tipos_camarao from '../Models/Camarao.js';
import SitiosxCativeiros from '../Models/SitiosxCativeiros.js';
import Usuarios from '../Models/Usuario.js';

const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Diretório para onde as fotos serão enviadas
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Gera um nome único para evitar conflitos
    }
});

const upload = multer({ storage });

//listar cativeiros de acordo com o sitio 
router.get('/cativeiros', async (req, res) => {
  try {
    // 1. Verificar se o usuário está autenticado
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send("Usuário não autenticado.");
    }

    const id_usuario = req.session.user.id; // Obtém o id do usuário logado

    // 2. Obter o ID do sítio associado ao usuário logado
    const usuarioSItio = await UsuariosxSitios.findOne({ where: { id_user: id_usuario } });
    if (!usuarioSItio) {
        req.flash('error', 'Sítio do usuário não encontrado.');
        return res.redirect('/cativeiros');
    }

    const id_sitio = usuarioSItio.id_sitio; // Obtém o id_sitio associado ao usuário

    // 3. Buscar cativeiros associados ao id_sitio na tabela SitiosXCativeiros
    const cativeiros = await SitiosxCativeiros.findAll({
      where: { id_sitio: id_sitio },
      include: [
        {
          model: Cativeiros,
          as: 'cativeiro', // Trazendo os cativeiros associados
          include: [{
            model: Tipos_camarao,
            as: 'camarao',
            attributes: ['nome'] // Seleciona o nome do tipo de camarão
          }]
        }
      ]
    });

    // 4. Se não houver cativeiros, retorna uma mensagem informando
    if (!cativeiros || cativeiros.length === 0) {
      return res.render("cativeiros", { message: "Nenhum cativeiro encontrado para o seu sítio." });
    }

    // 5. Passa os cativeiros para a view
    const cativeirosData = cativeiros.map(item => item.cativeiro);

    // Aqui, a variável cativeirosData precisa ser passada para o EJS
    res.render("cativeiros", { cativeiros: cativeirosData });

  } catch (error) {
    console.error("Erro ao buscar cativeiros:", error);
    res.status(500).send("Erro ao buscar cativeiros.");
  }
});


// Rota para exibir o formulário de criação de um novo cativeiro
router.get("/cativeiros/new", (req, res) => {
    const tipoId = req.query.tipoId;

    if (!tipoId) {
        req.flash('error', 'Tipo de camarão não especificado.');
        return res.redirect('/camaroes');
    }

    Tipos_camarao.findByPk(tipoId)
    .then(tipo => {
        if (!tipo) {
            req.flash('error', 'Tipo de camarão não encontrado.');
            return res.redirect('/camaroes');
        }

        res.render("tanquesNew", { tipoId });
    })
    .catch((error) => {
        console.error("Erro ao verificar tipo de camarão:", error);
        req.flash('error', 'Erro ao verificar tipo de camarão.');
        res.redirect('/camaroes');
    });
});

// Cadastro de cativeiro
router.post("/cativeiros/new", upload.single('foto_cativeiro'), async (req, res) => {
  const { id_tipo_camarao, data_instalacao } = req.body;
  const foto_cativeiro = req.file ? req.file.filename : null;
  const id_usuario = req.session.user ? req.session.user.id : null;

  if (!id_usuario) {
      req.flash('error', 'Usuário não logado.');
      return res.redirect('/login');
  }

  // Verificando se os campos obrigatórios estão presentes
  if (!id_tipo_camarao || !data_instalacao || !foto_cativeiro) {
      req.flash('error', 'Todos os campos são obrigatórios.');
      return res.redirect(`/cativeiros/new?tipoId=${id_tipo_camarao}`);
  }

  try {
      // Logando os dados para depuração
      console.log("Dados recebidos para cadastro do cativeiro:");
      console.log("id_tipo_camarao:", id_tipo_camarao);
      console.log("data_instalacao:", data_instalacao);
      console.log("foto_cativeiro:", foto_cativeiro);
      console.log("id_usuario:", id_usuario);

      // Cadastro do cativeiro
      const newCativeiro = await Cativeiros.create({
          id_tipo_camarao,
          data_instalacao,
          foto_cativeiro,
      });

      console.log("Cativeiro cadastrado com sucesso:", newCativeiro);

      // Obter o ID do sítio associado ao usuário logado
      const userSite = await UsuariosxSitios.findOne({ where: { id_user: id_usuario } });
      if (!userSite) {
          req.flash('error', 'Sítio do usuário não encontrado.');
          return res.redirect('/cativeiros');
      }

      const id_sitio = userSite.id_sitio;
      console.log("Sítio associado ao usuário:", userSite);

      // Verifique os dados antes de criar a associação
      console.log("Tentando associar o cativeiro ao sítio:", { id_sitio, id_cativeiro: newCativeiro.id_cativeiro });

      // Cadastro automático em sitios_x_cativeiros
      try {
          await SitiosxCativeiros.create({
              id_sitio: id_sitio,
              id_cativeiro: newCativeiro.id_cativeiro,
          });
          console.log("Associação criada com sucesso entre o cativeiro e o sítio!");
      } catch (err) {
          console.error("Erro ao associar cativeiro ao sítio:", err);
          req.flash('error', 'Erro ao associar o cativeiro ao sítio.');
          return res.redirect('/cativeiros');
      }

      req.flash('success', 'Cativeiro e associação cadastrados com sucesso!');
      res.redirect(`/condicoes/new?id_tipo_camarao=${id_tipo_camarao}`);
  } catch (error) {
      console.error("Erro ao cadastrar cativeiro:", error);
      req.flash('error', 'Erro ao cadastrar o cativeiro.');
      res.redirect('/cativeiros');
  }
});



export default router;
