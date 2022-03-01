const express = require('express')
const AcaoController = require('../controllers/acaoController')

// gerenciador de rotas do express
const router = express.Router()

/* ROTAS GET **********************************************************************/
router.get('/', // cria a rota de adição das tasks '/tasks/add'
    AcaoController.listAcoes // função a ser invocada (passando req e res) quando a rota for chamada
)
router.get('/detalhes/:id', // cria a rota de adição das tasks '/tasks/add'
    AcaoController.listDetalhes // função a ser invocada (passando req e res) quando a rota for chamada
)

/* ROTAS POST **********************************************************************/

module.exports = router;