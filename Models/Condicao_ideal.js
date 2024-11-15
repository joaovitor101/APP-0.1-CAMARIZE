import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";
import Tipos_camarao from './Camarao.js';  // Importa o modelo de Tipos_camarao

const Condicoes_ideais = connection.define('Condicoes_ideais',{
    id_condicao:{
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
      temp_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      ph_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      amonia_ideal: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
    }, {
      tableName: 'Condicoes_ideais'
    });
    Condicoes_ideais.belongsTo(Tipos_camarao, {
        foreignKey: 'id_tipo_camarao',  // A chave estrangeira
        as: 'camarao',  // Alias para a relação reversa
      });
    
    export default Condicoes_ideais;
    