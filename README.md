# Bovespa Sys Express

Exemplo de um sistema que faz uso da técnica de Data Scraping para obtenção de dados das ações da Bovespa.

Construído em Node.js seguindo o padrão MVC.

## FUNCIONAMENTO DO SISTEMA
Os sistema exibe na tela as informações das ações salvas no banco de dados.

A cada 15 minutos, o sistema busca e salva no banco de dados os preços atualizados das ações - através do site 'valorinveste.globo.com/cotacoes/'.

Ao clicar na botão de detalhes de cada ação, o sistema apresenta os seus dados detalhados, que são obtidos em tempo real através do site 'www.fundamentus.com.br'.

## TECNOLOGIAS E FERRAMENTAS UTILIZADAS
Node.js: implementação do Back-end

Express: framework web para Node.js

Handlebars: template engine para gerar páginas dinâmicas do Front-end

MySQL: SGBD para armazenar as informações de preço das ações

Sequelize: ORM para simplificar a conexão com o banco de dados MySQL

Node-cron: biblioteca utilizada para agendar a tarefa de atualização dos preços das ações

Axios: biblioteca utilizada para fazer requests HTTP

Cheerio: biblioteca utilizada para fazer Data Scraping das informações

Clique <a href="#" target="_blank">aqui</a> para acessar o sistema.

<img src="pics/img.jpg" width=44%>
