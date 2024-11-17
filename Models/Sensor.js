import Sequelize from "sequelize";
import DataTypes from 'sequelize';
import connection from "../config/sequelize-config.js";

const Sensores = connection.define('Sensores', {
  id_sensor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  id_tipo_sensor: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Tipos_sensor', // Refere-se ao modelo Tipos_sensor
      key: 'id_tipo_sensor', // Chave primária do Tipos_sensor
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  apelido: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  foto_sensor: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
}, {
  tableName: 'Sensores',
  timestamps: false,
});

// Agora você pode importar o modelo Tipos_sensor depois
import Tipos_sensor from './Tipos_sensor.js';  // Importa Tipos_sensor após a definição de Sensores

// Relacionamento entre Sensores e Tipos_sensor
Sensores.belongsTo(Tipos_sensor, {
  foreignKey: 'id_tipo_sensor',  // A chave estrangeira em Sensores
  as: 'tipo_sensor',  // Alias para acessar os dados do Tipos_sensor
});

export default Sensores;
