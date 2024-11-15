import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Sitios from './Sitio.js';
import Cativeiros from './Cativeiro.js';

const SitiosxCativeiros = connection.define('SitiosxCativeiros',
    {
        id_sitio_cativieiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Sitios, // Referência direta ao modelo importado
          key: 'id_sitio',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_cativeiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Cativeiros, // Referência direta ao modelo importado
          key: 'id_cativeiro',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      tableName: 'SitiosxCativeiros', // Usar nome em caixa baixa por padrão para tabelas
      timestamps: false, // Caso sua tabela não tenha colunas createdAt e updatedAt
    }
  );
  
  // Exportando o modelo
  export default SitiosxCativeiros;
  