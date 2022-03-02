const cron = require('node-cron')
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const hbs = require('express-handlebars')
const sequelize = require('./db/conn')
const acaoRoutes = require('./routes/AcaoRoutes')
const Acao = require('./models/Acao')

const port = process.env.PORT || 3000

// configurações do 'express'
const app = express()
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// configurações do 'handlebars'
app.engine('handlebars', hbs.engine()) // define a template engine do projeto
app.set('view engine', 'handlebars')


app.use(express.static('public')) // express config

// configurações das rotas Mestres
app.use('/acoes', acaoRoutes)

app.get('/sobre', // cria a rota de exibição das tasks '/tasks/'
    (req,res)=>{
        res.render('sobre')
    }
)

app.get('/', // cria a rota de exibição das tasks '/tasks/'
    (req,res)=>{
        res.redirect('/acoes/')
    }
)

/* Conecta o banco de dados antes de iniciar a aplicação */
sequelize
    .sync()
    .then(() => {
        app.listen(port, () => { console.log(`Executando na porta ${port}`) })
        
        updateCotacoes() // atualiza as cotações no banco de dados
        
        /* Agendador de tarefa. Executa a atualização das ações no banco a cada 15 min*/
        cron.schedule('*/15 * * * *', () => {
            console.log("Atualizando...");
            updateCotacoes() // atualiza as cotações no banco de dados
        });
    })
    .catch(err => { console.log(err) })

/* FUNÇÕES DO BACK-END ************************************/
async function updateCotacoes(){
    // busca as cotações das ações (scrapping)
    const acoes = await loadCotacoes()
    // conta a quantidade de registros existentes na tabela 'Acoes'
    const qt = await Acao.count()
    
    if(qt){ // se houver registros na tabela, precisamos apenas atualizar
        // atualiza cada uma das ações no banco de dados
        acoes.map( (acao, index)=>{
            Acao.update(acao,{where:{code:acao.code}})
        })
    }else{ // caso não haja registros, precisamos criá-los
        // salvar cada uma das ações no banco de dados
        acoes.map( (acao, index)=>{
            Acao.create(acao)
        })
    }
}

// Busca 'nome','código' e 'preço' das ações da BOVESPA
async function loadCotacoes() {
    try {
        // carrega o html do site com as cotações
        const buffer = await axios.get('https://valorinveste.globo.com/cotacoes/')
        const html = buffer.data // extrai o código html
        const $ = cheerio.load(html) // converte para json mais legível
        // faz a filtragem com base nos seletores desejados
        let acoes = []
        $('tbody > tr').each((index, elem) => {
            // captura os dados do 'nome','código' e 'preço' de cada uma das ações
            const lines = $(elem).find('.table-date-value')
            const name = lines[0].children[0].data.trim()
            // verifica se o ativo não é um fundo imobiliário (FII)
            if (!name.toLowerCase().startsWith('fii')) {
                const code = lines[1].children[0].data.trim()
                const price = lines[2].children[0].data.trim()
                const acao = {
                    name, code, price
                }
                acoes.push(acao)
            }
        })
        return acoes // retorna as ações carregadas
    } catch (err) {
        console.log(err)
        return null
    }
}