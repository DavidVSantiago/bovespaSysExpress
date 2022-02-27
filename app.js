const axios = require('axios')
const cheerio = require('cheerio')
const { each } = require('cheerio/lib/api/traversing')
const express = require('express')

const port = process.env.port || 4000

const app = express()

async function loadCotacoes() {

    try {
        // carrega o html do site
        const html = await axios.get('https://valorinveste.globo.com/cotacoes/')
        const $ = cheerio.load(html.data) // converte para json mais legível
        // faz a filtragem com base nos seletores desejados
        let acoes = []
        $('tbody > tr').each((index, elem) => {
            const lines = $(elem).find('.table-date-value')
            const name = lines[0].children[0].data
            const code = lines[1].children[0].data
            const price = lines[2].children[0].data
            const acao = {
                name, code, price
            }
            acoes.push(acao)
        })
        console.log(acoes);
    } catch (err) {
        console.log(err);
    }
}

loadCotacoes()