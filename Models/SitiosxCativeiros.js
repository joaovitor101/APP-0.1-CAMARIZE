import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Sitios from './Sitio.js';  // Modelo de Sitios
import Cativeiros from './Cativeiro.js';  // Modelo de Cativeiros

// Definindo o modelo de relacionamento SitiosXCativeiros
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
      model: 'Sitios',  // Nome da tabela
      key: 'id_sitio',  // Chave primária 
    },
    onDelete: 'CASCADE',  // Excluir quando o sítio for deletado
    onUpdate: 'CASCADE',  // Atualizar quando o sítio for alterado
  },
  id_cativeiro: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Cativeiros',  // Nome da tabela
      key: 'id_cativeiro',  // Chave primária 
    },
    onDelete: 'CASCADE',  // Excluir quando o cativeiro for deletado
    onUpdate: 'CASCADE',  // Atualizar quando o cativeiro for alterado
  }
}, {
  tableName: 'sitios_x_cativeiros', // Nome plural da tabela
  timestamps: false,
});

// Associação com Sitios
SitiosXCativeiros.belongsTo(Sitios, {
  foreignKey: 'id_sitio',  // Chave estrangeira
  as: 'sitio',  // Alias da associação
});

// Associação com Cativeiros
SitiosXCativeiros.belongsTo(Cativeiros, {
  foreignKey: 'id_cativeiro',  // Chave estrangeira
  as: 'cativeiro',  // Alias da associação
});

// Sincronizando a tabela (pode ser feito em um processo separado)
SitiosXCativeiros.sync({ force: false }).then(() => {
  console.log("Tabela SitiosXCativeiros sincronizada com sucesso!");
}).catch((error) => {
  console.log("Erro ao sincronizar a tabela SitiosXCativeiros: ", error);
});

export default SitiosXCativeiros;
