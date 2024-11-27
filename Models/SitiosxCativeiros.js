import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Sitios from './Sitio.js';  // Modelo de Sitios
import Cativeiros from './Cativeiro.js';  // Modelo de Cativeiros

const SitiosXCativeiros = connection.define('SitiosXCativeiros', {
    id_sitio_cativeiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'sitios',  // Nome da tabela
            key: 'id_sitio',  // Chave primária 
        },
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE',  
    },
    id_cativeiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'cativeiros',  
            key: 'id_cativeiro',  
        },
        onDelete: 'CASCADE',  
        onUpdate: 'CASCADE', 
    }
}, {
    tableName: 'SitiosXCativeiros'  
});

// Associação com o modelo Sitios
SitiosXCativeiros.belongsTo(Sitios, {
    foreignKey: 'id_sitio',  // Define a chave estrangeira para Sitios
    as: 'sitio',  // Nome da associação reversa
});

// Associação com o modelo Cativeiros
SitiosXCativeiros.belongsTo(Cativeiros, {
    foreignKey: 'id_cativeiro',  
    as: 'cativeiro',  
});

export default SitiosXCativeiros;
