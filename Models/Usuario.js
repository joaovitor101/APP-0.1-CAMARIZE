import Sequelize from "sequelize"
import connection from "../config/sequelize-config.js";
import DataTypes from 'sequelize';

const Usuarios = connection.define('usuarios' ,{
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
    foto_perfil:{
        type: DataTypes.BLOB('long'),
    allowNull: true,
    },
});
Usuarios.sync({force: false});
export default Usuarios