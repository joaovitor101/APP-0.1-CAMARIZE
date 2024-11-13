import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

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
    tableName: 'Especif_camarao'
  });
  
  export default Tipos_camarao;
  //fazer esse so dps de dieta e condicoes