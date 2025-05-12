// Importando o Sequelize

import Sequelize  from "sequelize";

// Criando os dados de conexão com banco de dados

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '1234', 
    //Comente essa linha na primeira execução da aplicação
    database: 'camarize',
    timezone: '-03:00',
    logging: false
})

export default connection