// ORM - Sequelize
import Sequelize from "sequelize"

// Configuração do Sequelize
import connection from "../config/sequelize-config.js"

// .define cria a trabela no banco
const Sitios = connection.define('Sitios', {

    id_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },

    rua:{
        type: Sequelize.STRING,
        allowNull: false
    },

    bairro: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numero: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    }, 
    {
    tableName: 'Sitios',
    });

// Não força a criação da tabela caso já exista
Sitios.sync({force: false})

export default Sitios;