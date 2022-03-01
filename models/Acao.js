const {DataTypes} = require('sequelize')
const sequelize  = require('../db/conn')

/* Definição da tabela do banco de dados*/
const Acao = sequelize.define('Acao', // nome da tabela no banco
    { // OBS: o 1º campo (o campo ID) é criado automaticamente
        name:{ // 2º campo da tabela
            type: DataTypes.STRING,
            require:true,
        },
        code:{ // 3º campo da tabela
            type: DataTypes.STRING,
            require:true,
        },
        price:{ // 4º campo da tabela
            type: DataTypes.STRING,
            require:true,
        },
    }
)

module.exports = Acao