import Sequelize from 'sequelize';
import connection from '../config/sequelize-config.js';

const Tipos_camarao = connection.define('Tipos_camarao', {
  id_tipo_camarao: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: Sequelize.STRING(100),
    allowNull: true,
  }
}, {
  tableName: 'Tipos_camarao'
});

export default Tipos_camarao;
