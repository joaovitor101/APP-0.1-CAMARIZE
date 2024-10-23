// ORM - Sequelize
import Sequelize from "sequelize"

// Configuração do Sequelize
import connection from "../config/sequelize-config.js"

// .define cria a trabela no banco
const Tanque = connection.define('tanques', {
    Local:{
        type: Sequelize.STRING,
        allowNull: false
    },

    data:{
        type: Sequelize.DATE,
        allowNull: false
    },

})

// Não força a criação da tabela caso já exista
Tanque.sync({force: false})

export default Tanque;