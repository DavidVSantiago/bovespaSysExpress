const Acao = require('../models/Acao.js') // imorta o model
const axios = require('axios')
const got = require('got');
const cheerio = require('cheerio')
const iso88592 = require('iso-8859-2')

// funções invocadas pelas Rotas da Acao
module.exports = {

    /* respondem às chamadas GET **********************************************************************/
    async listAcoes(req, res){ // invocada pela rota: get('/acoes/')
        // carrega todas as ações listadas no banco
        const acoes = await Acao.findAll({raw:true})
        res.render('home',{acoes}) // renderiza a view de exibição das ações
    },
    async listDetalhes(req, res){ // invocada pela rota: get('/acoes/detalhes/:id')
        // captura o id da ação selecionada
        const id = req.params.id
        // carrega (no banco de dados) o códgo da ação selecionada
        const acao = await Acao.findOne({where:{id:id},raw:true})
        // cria o escopo do objeto que irá armazenar os detalhes das informações da ação selecionada
        const fullData = {
            papel:'',cotacao:'',tipo:'',dataUltCotacao:'',nomeEmpresa:'',min52sem:'',setor:'',max52sem:'',subSetor:'',
            valorMercado:'',ultBalancoProc:'',valorFirma:'',nroAcoes:'',
            pl:'',lpa:'',p_vp:'',vpa:'',p_ebit:'',margBrut:'',psr:'',margEbit:'',p_ativos:'',margLiquida:'',p_capGiro:'',ebit_Ativo:'',p_ativCircLiq:'',roic:'',divYeld:'',roe:'',ev_Ebitda:'',liqCorrente:'',ev_Ebit:'',divBr_patrim:'',cresRec5anos:'',girosAtivos:'',
            ativo:'',divBruta:'',disponibilidades:'',divLiquida:'',ativoCirculante:'',patrimLiq:'',
            receitaLiquida12meses:'',receitaLiquida3meses:'',ebit12meses:'',ebit3meses:'',lucroLiquido12meses:'',lucroLiquido3meses:'',
        }
        try {
            // carrega o html do site com os detalhes da ação
            // a requisição é feita de forma binária para posterior decodificação
            const buffer = await axios.request({
                method: 'GET',
                url: `https://www.fundamentus.com.br/detalhes.php?papel=${acao.code}`,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            })
            // faz a decodificação, pois o site usa codificação 'iso-8859-1'
            const html = iso88592.decode(buffer.data.toString('binary'));

            const $ = cheerio.load(html) // converte para json mais legível
            // faz a filtragem com base nos seletores desejados
            $('.w728').each((index, table) => {
                console.log("PRINT!");
                const fields = $(table).find('.data > .txt')
                switch(index){
                    case 0: fillTable1(fields,fullData); break;
                    case 1: fillTable2(fields,fullData); break;
                    case 2: fillTable3(fields,fullData); break;
                    case 4: fillTable5(fields,fullData); break;
                }
            })
        } catch (err) {
            console.log(err)
        }
        res.render('acoes/details',{acao,fullData}) // renderiza a view de exibição das ações
    },
    
    /* respondem às chamadas POST **********************************************************************/


}
/* Funções de apoio ********************************************************************************/
function fillTable1(fields,fullData){
    fullData.papel = fields[0].children[0].data.trim()
    fullData.cotacao = fields[1].children[0].data.trim()
    fullData.tipo = fields[2].children[0].data.trim()
    fullData.dataUltCotacao = fields[3].children[0].data.trim()
    fullData.nomeEmpresa = fields[4].children[0].data.trim()
    fullData.min52sem = fields[5].children[0].data.trim()
    fullData.setor = fields[6].children[0].children[0].data.trim()
    fullData.max52sem = fields[7].children[0].data.trim()
    fullData.subSetor = fields[8].children[0].children[0].data.trim()
}
function fillTable2(fields,fullData){
    fullData.valorMercado = fields[0].children[0].data.trim()
    fullData.ultBalancoProc = fields[1].children[0].data.trim()
    fullData.valorFirma = fields[2].children[0].data.trim()
    fullData.nroAcoes = fields[3].children[0].data.trim()
}
function fillTable3(fields,fullData){
    fullData.pl = fields[0].children[0].data.trim() // pl
    fullData.lpa = fields[1].children[0].data.trim() // lpa
    fullData.p_vp = fields[2].children[0].data.trim() // p-vp
    fullData.vpa = fields[3].children[0].data.trim() // vpa
    fullData.p_ebit = fields[4].children[0].data.trim() // p-ebit
    fullData.margBrut = fields[5].children[0].data.trim() // margBrut
    fullData.psr = fields[6].children[0].data.trim() // psr
    fullData.margEbit = fields[7].children[0].data.trim() // margEbit
    fullData.p_ativos = fields[8].children[0].data.trim() // p-ativos
    fullData.margLiquida = fields[9].children[0].data.trim() // margLiquida
    fullData.p_capGiro = fields[10].children[0].data.trim() // p-capGiro
    fullData.ebit_Ativo = fields[11].children[0].data.trim() // ebit-Ativo
    fullData.p_ativCircLiq = fields[12].children[0].data.trim() // p-ativCircLiq
    fullData.roic = fields[13].children[0].data.trim() // roic
    fullData.divYeld = fields[14].children[0].data.trim() // divYeld
    fullData.roe = fields[15].children[0].data.trim() // roe
    fullData.ev_Ebitda = fields[16].children[0].data.trim() // ev-Ebitda
    fullData.liqCorrente = fields[17].children[0].data.trim() // liqCorrente
    fullData.ev_Ebit = fields[18].children[0].data.trim() // ev-Ebit
    fullData.divBr_patrim = fields[19].children[0].data.trim() // divBr-patrim
    fullData.cresRec5anos = fields[20].children[0].data.trim() // cresRec5anos
    fullData.girosAtivos = fields[21].children[0].data.trim() // girosAtivos
}
function fillTable5(fields,fullData){
    fullData.receitaLiquida12meses = fields[0].children[0].data.trim() // Receita Líquida 12 meses
    fullData.receitaLiquida3meses = fields[1].children[0].data.trim() // Receita Líquida 3 meses
    fullData.ebit12meses = fields[2].children[0].data.trim() // EBIT 12 meses
    fullData.ebit3meses = fields[3].children[0].data.trim() // EBIT 3 meses
    fullData.lucroLiquido12meses = fields[4].children[0].data.trim() // Lucro Líquido 12 meses
    fullData.lucroLiquido3meses = fields[5].children[0].data.trim() // Lucro Líquido 3 meses
}