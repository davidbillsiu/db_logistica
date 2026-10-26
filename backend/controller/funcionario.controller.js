const Funcionario = require('../models/Funcionario')
const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.nome || !valores.email || !valores.senha){
        return res.status(404).json({message:'Preencha todos os dados'})
    }

    try{
        const senhaCriptografado = cryptoJs.AES.encrypt(valores.senha,CHAVE_SECRETA).toString()

        await Funcionario.create({
            nome:valores.nome,
            email:valores.email,
            senha:senhaCriptografado
        })
        return res.status(201).json({message:'Dados Cadastrados com sucesso'})
    }catch(err){
        return res.status(500).json({message:'Erro ao cadastrar'})
    }
}

module.exports = Funcionario