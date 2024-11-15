import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Dietas from './Dieta.js';
import Condicoes_ideais from './Condicao_ideal.js';  

const Especif_camarao = connection.define('Especif_camarao', {
    id_especif: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_dieta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'dietas',
          key: 'id_dieta',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }, 
      id_condicao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'condicoes_ideais',
          key: 'id_condicao',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }, 
    tableName: 'Especif_camarao'
  });
  
  export default Especif_camarao;
  //fazer esse so dps de dieta e condicoes