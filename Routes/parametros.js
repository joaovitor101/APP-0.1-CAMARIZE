// Routes/parametros.js
import express from 'express';
import ParametrosAtuaisControllers from '../Controllers/ParametrosAtuaisControllers.js';

const router = express.Router();

// Define as rotas corretamente
router.post('/parametros_atuais', ParametrosAtuaisControllers.criar);
router.get('/parametros_atuais/ultimo', ParametrosAtuaisControllers.buscarUltimo);

export default router;
