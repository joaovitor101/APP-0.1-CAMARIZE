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
    onDelete: 'CASCADE',  // excluir
    onUpdate: 'CASCADE',  // atualizar
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
  tableName: 'SitiosXCativeiros', 
  timestamps: false, 
});

//associação com Sitios
SitiosXCativeiros.belongsTo(Sitios, {
  foreignKey: 'id_sitio',  // Chave estrangeira
  as: 'sitio',  // Alias da associação
});

//associação com Cativeiros
SitiosXCativeiros.belongsTo(Cativeiros, {
  foreignKey: 'id_cativeiro',  
  as: 'cativeiro',  
});

// Sincronizando a tabela
SitiosXCativeiros.sync({ force: false }).then(() => {
  console.log("Tabela SitiosXCativeiros sincronizada com sucesso!");
}).catch((error) => {
  console.log("Erro ao sincronizar a tabela SitiosXCativeiros: ", error);
});

export default SitiosXCativeiros;
