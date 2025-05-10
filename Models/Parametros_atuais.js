import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Cativeiros from './Cativeiro.js';

const Parametros_Atuais = connection.define('Parametros_atuais', {
  id_parametros_atuais: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  datahora: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  temp_atual: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  ph_atual: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  amonia_atual: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  id_cativeiro: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Cativeiros,
      key: 'id_cativeiro',
    }
  }
}, {
  tableName: 'parametros_atuais',
  timestamps: false
});

// Associações (opcional, se precisar fazer joins mais tarde)
Parametros_Atuais.belongsTo(Cativeiros, { foreignKey: 'id_cativeiro' });

export default Parametros_Atuais;
