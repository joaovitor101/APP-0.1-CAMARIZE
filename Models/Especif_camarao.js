import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Dietas from './Dieta.js';
import CondicoesIdeais from './Condicao_ideal.js';

const EspecifCamarao = connection.define(
  'Especif_camarao',
  {
    id_especif: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_dieta: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Dietas, // Referência direta ao modelo importado
        key: 'id_dieta',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_condicao: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: CondicoesIdeais, // Referência direta ao modelo importado
        key: 'id_condicao',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'especif_camarao', // Usar nome em caixa baixa por padrão para tabelas
    timestamps: false, // Caso sua tabela não tenha colunas createdAt e updatedAt
  }
);

// Exportando o modelo
export default EspecifCamarao;
