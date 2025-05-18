import Sequelize from "sequelize";
import connection from "../Config/sequelize-config.js";

const Dietas = connection.define(
  "Dietas",
  {
    id_dieta: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    horaAlimentacao: {
      type: Sequelize.TIME,
      allowNull: false, // ou true, dependendo do seu caso
    },
    quantidade:{
        type: Sequelize.FLOAT,
        allowNull: false
    }
  },
  {
    tableName: "Dietas",
  }
);

    
    export default Dietas;
    