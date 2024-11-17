import Sequelize from "sequelize"; // Use apenas Sequelize
// Importação correta para o Sequelize
import connection from "../config/sequelize-config.js";

// .define cria a tabela no banco
const Cliente = connection.define('clientes', {
    id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Adiciona a restrição de email único
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto_perfil: {
        type: Sequelize.BLOB('long'), // Usando Sequelize.DataTypes diretamente
        allowNull: true // Permite que a foto seja opcional
    }
});

// Não força a criação da tabela caso já exista, mas garante que ela será sincronizada se necessário
Cliente.sync({ alter: true });

export default Cliente;
