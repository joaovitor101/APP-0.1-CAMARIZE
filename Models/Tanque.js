// ORM - Sequelize
import Sequelize from "sequelize";
import DataTypes from 'sequelize';

// Configuração do Sequelize
import connection from "../config/sequelize-config.js";

// Definindo o modelo Tanque
const Tanque = connection.define('tanques', {
    foto_cativeiro: {
        type: DataTypes.BLOB('long'), // Usando BLOB para armazenar arquivos binários
        allowNull: true
    },

    data_instalacao: {
        type: Sequelize.DATE,
        allowNull: false
    },

    temp_media_diaria: {
        type: Sequelize.STRING, // Usando FLOAT para armazenar valores numéricos
        allowNull: false
    },

    ph_medio_diario: {
        type: Sequelize.STRING, // Usando FLOAT para valores de pH
        allowNull: false
    },

    amonia_media_diaria: {
        type: Sequelize.STRING, // Usando FLOAT para valores de amônia
        allowNull: false
    },
}, {
    // Definindo o nome da tabela no banco de dados (opcional)
    tableName: 'tanques', 
    timestamps: false // Definindo que a tabela não vai ter os campos de timestamps (createdAt, updatedAt)
});

// Não força a criação da tabela caso já exista
Tanque.sync({ force: false })  // Definindo force como false para não recriar a tabela
  .then(() => console.log('Tabela de Tanques sincronizada!'))
  .catch(err => console.log('Erro ao sincronizar a tabela:', err));

export default Tanque;
