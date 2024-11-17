import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Sitios from './Sitio.js';
import Users from './Usuario.js';

const UsuariosxSitios = connection.define('UsuariosxSitios', 
    {
      id_usuario_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Users,  // Referência direta ao modelo Users
          key: 'id_user',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Sitios,  // Referência direta ao modelo Sitios
          key: 'id_sitio',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      tableName: 'UsuariosxSitios', // Nome da tabela em caixa baixa
      timestamps: false, // Caso sua tabela não tenha colunas createdAt e updatedAt
    }
  );

// Definindo as associações entre as tabelas
Users.hasMany(UsuariosxSitios, { foreignKey: 'id_user' }); // Um usuário pode ter muitos 'UsuariosxSitios'
Sitios.hasMany(UsuariosxSitios, { foreignKey: 'id_sitio' }); // Um sítio pode ter muitos 'UsuariosxSitios'

UsuariosxSitios.belongsTo(Users, { foreignKey: 'id_user' }); // 'UsuariosxSitios' pertence a 'Users'
UsuariosxSitios.belongsTo(Sitios, { foreignKey: 'id_sitio' }); // 'UsuariosxSitios' pertence a 'Sitios'

// Exportando o modelo
export default UsuariosxSitios;
