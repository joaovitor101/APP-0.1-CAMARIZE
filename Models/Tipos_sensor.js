import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Tipos_sensor = connection.define('Tipos_sensor', {
    id_tipo_sensor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: Sequelize.STRING(100),
      allowNull: true,
    }
  }, {
    tableName: 'Tipos_sensor'
  });
  
  export default Tipos_sensor;
  