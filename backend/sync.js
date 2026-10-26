const {Funcionario, Entrega, Carga, Motorista} = require('./models/rel')
const conn = require('./db/conn')

async function syncDataBase() {
    try{
        await conn.sync({force:true})
        console.log('banco sincronizando')
    }catch(err){
        console.log('erro ao sincronizar ',err)
    }finally{
        await conn.close()
        console.log('fechando o banco')
    }
}


syncDataBase()