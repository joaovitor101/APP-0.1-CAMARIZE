import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Sensores from './Sensor.js';
import Cativeiros from './Cativeiro.js';

const SensoresxCativeiros = connection.define('SensoresxCativeiros',
    {
        id_sensor_cativieiro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_sensor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Sensores, // Referência direta ao modelo importado
          key: 'id_sensor',
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
      tableName: 'SensoresxCativeiros', // Usar nome em caixa baixa por padrão para tabelas
      timestamps: false, // Caso sua tabela não tenha colunas createdAt e updatedAt
    }
  );
  
  // Exportando o modelo
  export default SensoresxCativeiros;
  