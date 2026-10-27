const Funcionario = require('../models/Funcionario')
const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const login = async(req,res)=>{
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(404).json({message:'todos os campos são obrigatorios'})
    }
    
    try{
        
        const funcionario = await Funcionario.findOne({where:{email:valores.email}})
        
        const bytes = cryptoJs.AES.decrypt(valores.senha,CHAVE_SECRETA)
        const senhaDesc = bytes.toString(cryptoJs.enc.Utf8)
        
        if(valores.senha !== senhaDesc){
            return res.status(404).json({message:'senha incorreta'})
        }
        
        const tresHorasEmMs = 3 * 60 * 60 * 1000
        const tempoExpiracao = Date.now() + tresHorasEmMs
        
        const payload = {
            idFuncionario:funcionario.codFuncionario,
            nome:funcionario.nome,
            expiraEm: tempoExpiracao
        }

        const token = cryptoJs.AES.encrypt(JSON.toString(payload),CHAVE_SECRETA).toString()

        return res.status(200).json({
            message:'Login realizado com sucesso',
            nome:funcionario.nome,
            token:token
        })
    }catch(err){
        return res.status(500).json({message:'Erro ao logar'})
    }
}

module.exports = {login}