const {Sequelize} = require('sequelize')

/* Cria uma instancia do Sequelize com as informações do banco de dados */
const sequelize = new Sequelize('heroku_da312469df1c0c0','b2f03fc1812555','349e0765',{
    host: 'localhost',
    dialect: 'mysql',
})

// estabelece a conexão com o banco de dados
try{
    sequelize.authenticate() // conecta com o banco
    console.log('conectamos com o banco');
}catch(err){
    console.log(`Erro ao conectar o banco de dados: ${err}`);
}

module.exports = sequelize
