const express = require('express')
const app = express()
const cors = require('cors')

const PORT = 3000
const hostname = 'localhost'

const conn = require('./db/conn')

require('./models/rel')

const authMiddleware = require('./middleware/auth.middleware')
const authController = require('./controller/auth.controller')
const funcionarioController = require('./controller/funcionario.controller')
const motoristaController = require('./controller/motorista.controller')
const cargaController = require('./controller/carga.controller')
const entregaController = require('./controller/entrega.controller')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.post('/funcionario', funcionarioController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req,res)=>{
    res.status(200).json({message:'Aplicação de Logística Rodando!'})
})

app.use(authMiddleware)

// Rotas privadas do Motorista (CRUD Completo + busca por nome)
app.post('/motorista', motoristaController.cadastrar)
app.get('/motoristas', motoristaController.listar)
app.get('/motorista/buscarNome/:nome', motoristaController.consultarPorNome)
app.get('/motorista/:id', motoristaController.consultarPorCod)
app.put('/motorista/:id', motoristaController.atualizar)
app.delete('/motorista/:id', motoristaController.apagar)

// Rotas privadas de Carga e Entrega
app.post('/carga', cargaController.cadastrar)
app.post('/entrega', entregaController.cadastrar)
app.put('/entrega/:id', entregaController.atualizar)
app.get('/entregas', entregaController.listar)

// Sincroniza banco e inicia o servidor
conn.sync()

.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro ao conectar com o banco de dados', err)
})