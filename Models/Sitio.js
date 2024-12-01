import Sequelize, { DataTypes } from "sequelize";  // Corrigido para importar DataTypes
import connection from "../config/sequelize-config.js";

// Definindo o modelo Sitios
const Sitios = connection.define('Sitios', {
  id_sitio: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rua: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bairro: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cidade: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  numero: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  foto_sitio: {
    type: DataTypes.BLOB('long'),  // Corrigido: DataTypes deve ser usado aqui
    allowNull: true,
  },
}, {
  tableName: 'Sitios',
  timestamps: false,  
});

// Sincronizando
Sitios.sync({ force: false }).then(() => {
  console.log("Tabela Sitios sincronizada com sucesso!");
}).catch((error) => {
  console.log("Erro ao sincronizar a tabela Sitios: ", error);
});

export default Sitios;
