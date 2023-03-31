# :construction: README em construção ! :construction:
# Talker Manager

Projeto de Back End desenvolvido na Trybe

Esse projeto consiste em gerenciar palestrantes de um evento, é possível cadastrar, visualizar, pesquisar, editar e excluir informações das pessoas palestrantes. Isso tudo é feito com uma autenticação de login e utilizando middlewares, para validação dos dados. No fim, ainda fiz uma conexão com o MySQL para recuperar dados de um banco criado previamente. Foi o meu primeiro contato com criações de API, também foi utilizado o padrão Rest para desenvolvimento da API.

## Tecnologias e habilidades usadas

 - JavaScript
 - Node.js
 - Express
 - API Rest
 - MySQL
 - CRUD
 
Todos os arquivos desenvolvidos por mim estão dentro da pasta `src`, os restantes, são arquivos de configuração ou arquivos desenvolvidos pela Trybe

## Como rodar 🚀

Caso queira executar esse projeto em sua máquina utilizando o docker, você pode:
 * Fazer o clone desse repositório 
 * Instalar as dependências utilizando rodando em seu terminal `npm install`
 * Com o docker instalado e inicializado, rode em seu terminal `docker-compose up -d`
 * Execute os containers criados `docker exec -it <container-name> bash` e `docker exec -it <container-name-db> bash`
 * No container de back-end, rode `npm run dev`
 * No container do banco de dados, rode `mysql -u root -p` utilizando a senha configurada nas variaveis de ambiente do docker-compose.yml, `password`
 * Pronto! Agora só executar endpoints com as requisições configuradas no arquivo `src/index.js`

## Autor

**Melqui Brito de Jesus**

Linkedin: https://www.linkedin.com/in/melqui-brito-871676188/

Telegram: https://t.me/Merkulino

Email: Merkulino11@gmail.com

:shipit: 
