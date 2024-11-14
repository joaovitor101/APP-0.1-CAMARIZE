import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

const Dietas = connection.define('Dietas',{
    id_dieta:{
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
      tableName: 'Dietas'
    });
    
    export default Dietas;
    