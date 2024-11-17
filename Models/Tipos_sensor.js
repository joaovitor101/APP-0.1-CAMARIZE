import Sequelize from "sequelize";
import DataTypes from 'sequelize';
import connection from "../config/sequelize-config.js";

const Tipos_sensor = connection.define('Tipos_sensor', {
    id_tipo_sensor: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'Tipos_sensor'
  });
  
// Adicionar valores iniciais
(async () => {
  try {
    // Sincroniza o modelo com o banco de dados (apenas se necessário)
    await Tipos_sensor.sync();

    // Verifica se os registros já existem para evitar duplicação
    const count = await Tipos_sensor.count();
    if (count === 0) {
      await Tipos_sensor.bulkCreate([
        { descricao: 'Temperatura', foto_sensor: null },
        { descricao: 'PH', foto_sensor: null },
        { descricao: 'Amonia', foto_sensor: null },
        { descricao: 'Nível de raçao', foto_sensor: null },
        { descricao: 'Motor dispensador de raçao', foto_sensor: null },
      ]);
      console.log("Valores iniciais adicionados com sucesso!");
    } else {
      console.log("Valores iniciais já existem no banco de dados.");
    }
  } catch (error) {
    console.error("Erro ao adicionar valores iniciais:", error);
  }
})();

  export default Tipos_sensor;
  