const Acao = require('../models/Acao.js') // imorta o model

// funções invocadas pelas Rotas da Acao
module.exports = {

    /* respondem às chamadas GET **********************************************************************/
    async listAcoes(req, res){ // invocada pela rota: get('/acoes/')
        // carrega todas as ações listadas no banco
        const acoes = await Acao.findAll({raw:true})

        // obtém o tempo da ultima atualização (de qualquer um dos registros do banco)
        const timeLastUpdate = acoes[0].updatedAt

        // renderiza a view de exibição das ações
        res.render('home',{acoes,timeLastUpdate})
    },
    async listDetalhes(req, res){ // invocada pela rota: get('/acoes/detalhes/:id')
        // captura o id da ação selecionada
        const id = req.params.id
        // carrega (no banco de dados) o códgo da ação selecionada
        const acao = await Acao.findOne({where:{id:id},raw:true})
        // renderiza a view de exibição das ações
        res.render('acoes/details',{acao})
    },
    
    /* respondem às chamadas POST **********************************************************************/


}
