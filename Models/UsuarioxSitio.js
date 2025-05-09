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
          model: Usuarios,  // Referência direta ao modelo Users
          key: 'id_user',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      id_sitio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Sitios, 
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

//associações entre as tabelas
Usuarios.hasMany(UsuariosxSitios, { foreignKey: 'id_user', as: 'UsuariosSitios' }); 
Sitios.hasMany(UsuariosxSitios, { foreignKey: 'id_sitio', as: 'SitiosUsuarios' }); 

UsuariosxSitios.belongsTo(Usuarios, { foreignKey: 'id_user', as: 'Usuario' }); 
UsuariosxSitios.belongsTo(Sitios, { foreignKey: 'id_sitio', as: 'Sitio' }); // Alias adicionado aqui


// Exportando o modelo
export default UsuariosxSitios;
