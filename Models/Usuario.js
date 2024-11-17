import Sequelize from "sequelize"
import connection from "../config/sequelize-config.js";

const Users = connection.define('user' ,{
    id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Garante que o e-mail será único
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
Users.sync({force: false});
export default Users