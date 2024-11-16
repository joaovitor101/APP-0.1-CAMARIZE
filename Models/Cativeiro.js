import Sequelize from "sequelize";
import DataTypes from 'sequelize';
import connection from "../config/sequelize-config.js";
import Tipos_camarao from './Camarao.js';  

const Cativeiros = connection.define('Cativeiros', {
  id_cativeiro: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  id_tipo_camarao: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_camarao',
      key: 'id_tipo_camarao',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  data_instalacao: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  foto_cativeiro: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  temp_media_diaria: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ph_medio_diario: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  amonia_media_diaria: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Cativeiros',
  timestamps: false 
});
Cativeiros.belongsTo(Tipos_camarao, {
  foreignKey: 'id_tipo_camarao',  
  as: 'camarao',  
});


export default Cativeiros;
