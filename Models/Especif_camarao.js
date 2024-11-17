import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Dietas from './Dieta.js';
import Condicoes_ideais from './Condicao_ideal.js';
import Tipos_camarao from './Camarao.js';

const Especif_camarao = connection.define(
  'Especif_camarao',
  {
    id_especif: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_tipo_camarao: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Tipos_camarao,
        key: 'id_tipo_camarao',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_dieta: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Dietas,
        key: 'id_dieta',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    id_condicao: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Condicoes_ideais,
        key: 'id_condicao',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    tableName: 'especif_camarao',
    timestamps: false,
  }
);

// Configuração de associações
Tipos_camarao.hasMany(Especif_camarao, { foreignKey: 'id_tipo_camarao' });
Dietas.hasMany(Especif_camarao, { foreignKey: 'id_dieta' });
Condicoes_ideais.hasMany(Especif_camarao, { foreignKey: 'id_condicao' });

Especif_camarao.belongsTo(Tipos_camarao, { foreignKey: 'id_tipo_camarao' });

Especif_camarao.belongsTo(Dietas, { foreignKey: 'id_dieta' });

Especif_camarao.belongsTo(Condicoes_ideais, { foreignKey: 'id_condicao' });

export default Especif_camarao;