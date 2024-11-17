import Sequelize from "sequelize";
import DataTypes from 'sequelize';
import connection from "../config/sequelize-config.js";
import Tipos_sensor from "./Tipos_sensor.js";

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

// Relacionamento entre Sensores e Tipos_sensor
Sensores.belongsTo(Tipos_sensor, {
  foreignKey: 'id_tipo_sensor',  
  as: 'tipo_sensor',  
});

Tipos_sensor.hasMany(Sensores, {
  foreignKey: 'id_tipo_sensor', 
  as: 'sensores', 
});

export default Sensores;
