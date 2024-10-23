// ORM - Sequelize
import Sequelize from "sequelize"

// Configuração do Sequelize
import connection from "../config/sequelize-config.js"

// .define cria a trabela no banco
const Fazenda = connection.define('fazendas', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },

    cpf:{
        type: Sequelize.STRING,
        allowNull: false
    },

    endereco: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Não força a criação da tabela caso já exista
Fazenda.sync({force: false})

export default Fazenda