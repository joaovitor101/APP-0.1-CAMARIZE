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
          model: 'Tipos_sensor',
          key: 'id_tipo_sensor',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    timestamps: false 
});
Tipos_sensor.belongsTo(Tipos_sensor, {
  foreignKey: 'id_tipo_sensor',  
  as: 'sensor',  
});

  export default Sensores;
  