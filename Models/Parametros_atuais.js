import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

import Cativeiros from "./Cativeiro.js";

const Parametros_atuais = connection.define('Parametros_atuais', {
    id_parametros_atuais: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      datahora:{
        type: Sequelize.DATE,
        allownull: true,
      },
      temp_atual: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      ph_atual: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      amonia_atual: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      id_cativeiro: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'dietas',
            key: 'id_dieta',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }, 
        tableName: Parametros_atuais,
});

export default Parametros_atuais;