const Funcionario = require('../models/Funcionario')
const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const login = async(req,res)=>{
    const valores = req.body

    if(!valores.email || !valores.senha){
        return res.status(400).json({message:'Informe e-mail e senha para realizar o login!'})
    }

    try{
        const funcionario = await Funcionario.findOne({where:{email:valores.email}})

        if(!funcionario){
            return res.status(404).json({message:'Funcionário não encontrado!'})
        }

        const bytes = cryptoJs.AES.decrypt(funcionario.senha,CHAVE_SECRETA)
        const senhaBD = bytes.toString(cryptoJs.enc.Utf8)

        if(valores.senha !== senhaBD){
            return res.status(401).json({message:'Senha incorreta!'})
        }

        // Tempo de uso do sistema: 180 minutos (3h * 60m * 60s * 1000ms)
        const tresHorasEmMs = 180 * 60 * 1000
        const tempoExpiracao = Date.now() + tresHorasEmMs

        const payload = {
            idFuncionario:funcionario.codFuncionario,
            nome:funcionario.nome,
            expiraEm:tempoExpiracao
        }

        const token = cryptoJs.AES.encrypt(JSON.stringify(payload),CHAVE_SECRETA).toString()

        return res.status(200).json({
            message:'Login realizado com sucesso!',
            token:token,
            nome:funcionario.nome
        })
    }catch(err){
        console.error('Erro ao tentar fazer o login:',err)
        return res.status(500).json({message:'Erro ao tentar fazer o login!'})
    }
}

module.exports = {login}
