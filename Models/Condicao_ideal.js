import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Tipos_camarao from './Camarao.js';  // Importa o modelo de Tipos_camarao

const Condicoes_ideais = connection.define('Condicoes_ideais', {
    id_condicao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_tipo_camarao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'tipos_camarao',  // Nome da tabela que está sendo referenciada
            key: 'id_tipo_camarao',  // Chave primária da tabela referenciada
        },
        onDelete: 'CASCADE',  // Caso o tipo de camarão seja excluído, as condições ideais associadas também serão
        onUpdate: 'CASCADE',  // Caso o tipo de camarão seja atualizado, as condições ideais associadas também serão
    },
    temp_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    ph_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    amonia_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
}, {
    tableName: 'Condicoes_ideais'  // Define o nome exato da tabela
});

// Associação com o modelo Tipos_camarao
Condicoes_ideais.belongsTo(Tipos_camarao, {
    foreignKey: 'id_tipo_camarao',  // Define a chave estrangeira que faz referência à tabela Tipos_camarao
    as: 'camarao',  // Nome dado à associação reversa (não obrigatório, mas recomendado)
});

export default Condicoes_ideais;
