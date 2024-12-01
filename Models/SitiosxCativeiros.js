import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Sitios from './Sitio.js';  // Importando o modelo de Sitios
import Cativeiros from './Cativeiro.js';  // Importando o modelo de Cativeiros

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
      model: 'Sitios',
      key: 'id_sitio',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  id_cativeiro: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Cativeiros',
      key: 'id_cativeiro',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  tableName: 'sitios_x_cativeiros', // Nome da tabela
  timestamps: false,
});

// Associação com Sitios
SitiosXCativeiros.belongsTo(Sitios, {
  foreignKey: 'id_sitio',
  as: 'sitio',
});

// Associação com Cativeiros
SitiosXCativeiros.belongsTo(Cativeiros, {
  foreignKey: 'id_cativeiro',
  as: 'cativeiro',
});

export default SitiosXCativeiros;
