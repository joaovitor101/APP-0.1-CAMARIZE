import Sequelize from "sequelize";
import connection from "../config/sequelize-config.js";

// Importação dos modelos relacionados
import Sitios from './Sitio.js';
import Usuarios from './Usuario.js';

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
          model: Usuarios,  // Referência direta ao modelo Usuarios
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
Usuarios.hasMany(UsuariosxSitios, { foreignKey: 'id_user' }); // Um usuário pode ter muitos 'UsuariosxSitios'
Sitios.hasMany(UsuariosxSitios, { foreignKey: 'id_sitio' }); // Um sítio pode ter muitos 'UsuariosxSitios'

// Definir os alias nas associações
UsuariosxSitios.belongsTo(Usuarios, { foreignKey: 'id_user' }); // 'UsuariosxSitios' pertence a 'Usuarios'
UsuariosxSitios.belongsTo(Sitios, { as: 'sitio', foreignKey: 'id_sitio' }); // 'UsuariosxSitios' pertence a 'Sitios' com alias

// Exportando o modelo
export default UsuariosxSitios;
