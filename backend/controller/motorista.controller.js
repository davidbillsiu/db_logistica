const Motorista = require('../models/Motorista')
const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.nome || !valores.cnh || !valores.cpf || !valores.telefone){
        return res.status(400).json({message:'Todos os campos (nome, cnh, cpf, telefone) são obrigatórios!'})
    }

    if(valores.cpf.length !== 11){
        return res.status(400).json({message:'O CPF deve conter exatamente 11 dígitos!'})
    }

    try{
        const cnhCriptografada = cryptoJs.AES.encrypt(valores.cnh,CHAVE_SECRETA).toString()
        const cpfCriptografado = cryptoJs.AES.encrypt(valores.cpf,CHAVE_SECRETA).toString()

        await Motorista.create({
            nome:valores.nome,
            cnh:cnhCriptografada,
            cpf:cpfCriptografado,
            telefone:valores.telefone
        })

        return res.status(201).json({message:'Motorista cadastrado com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar motorista:',err)
        return res.status(500).json({message:'Erro ao cadastrar motorista!'})
    }
}

const listar = async(req,res)=>{
    try{
        const motoristas = await Motorista.findAll()
        let resultado = []

        motoristas.forEach((el)=>{
            let cpfDescriptografado = ''
            let cnhDescriptografada = ''
            try{
                const bytesCpf = cryptoJs.AES.decrypt(el.cpf,CHAVE_SECRETA)
                const bytesCnh = cryptoJs.AES.decrypt(el.cnh,CHAVE_SECRETA)
                cpfDescriptografado = bytesCpf.toString(cryptoJs.enc.Utf8)
                cnhDescriptografada = bytesCnh.toString(cryptoJs.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar'
                cnhDescriptografada = 'Erro ao descriptografar'
                console.error('Erro ao descriptografar',err)
            }
            resultado.push({
                codMotorista:el.codMotorista,
                nome:el.nome,
                cnh:cnhDescriptografada,
                cpf:cpfDescriptografado,
                telefone:el.telefone
            })
        })

        return res.status(200).json(resultado)
    }catch(err){
        console.error('Erro ao listar motoristas:',err)
        return res.status(500).json({message:'Erro ao listar motoristas!'})
    }
}

const consultarPorCod = async(req,res)=>{
    const id = req.params.id

    try{
        const motorista = await Motorista.findByPk(id)

        if(!motorista){
            return res.status(404).json({message:'Motorista não encontrado!'})
        }

        const bytesCpf = cryptoJs.AES.decrypt(motorista.cpf,CHAVE_SECRETA)
        const bytesCnh = cryptoJs.AES.decrypt(motorista.cnh,CHAVE_SECRETA)

        return res.status(200).json({
            codMotorista:motorista.codMotorista,
            nome:motorista.nome,
            cnh:bytesCnh.toString(cryptoJs.enc.Utf8),
            cpf:bytesCpf.toString(cryptoJs.enc.Utf8),
            telefone:motorista.telefone
        })
    }catch(err){
        console.error('Erro ao consultar motorista:',err)
        return res.status(500).json({message:'Erro ao consultar motorista!'})
    }
}

const consultarPorNome = async(req,res)=>{
    const nome = req.params.nome

    try{
        const motorista = await Motorista.findOne({where:{nome:nome}})

        if(!motorista){
            return res.status(404).json({message:'Motorista não encontrado!'})
        }

        const bytesCpf = cryptoJs.AES.decrypt(motorista.cpf,CHAVE_SECRETA)
        const bytesCnh = cryptoJs.AES.decrypt(motorista.cnh,CHAVE_SECRETA)

        return res.status(200).json({
            codMotorista:motorista.codMotorista,
            nome:motorista.nome,
            cnh:bytesCnh.toString(cryptoJs.enc.Utf8),
            cpf:bytesCpf.toString(cryptoJs.enc.Utf8),
            telefone:motorista.telefone
        })
    }catch(err){
        console.error('Erro ao consultar motorista por nome:',err)
        return res.status(500).json({message:'Erro ao consultar motorista por nome!'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const motorista = await Motorista.findByPk(id)
        if(!motorista){
            return res.status(404).json({message:'Motorista não encontrado!'})
        }

        const dadosAtualizados = {...valores}

        if(valores.cpf){
            if(valores.cpf.length !== 11){
                return res.status(400).json({message:'O CPF deve conter exatamente 11 dígitos!'})
            }
            dadosAtualizados.cpf = cryptoJs.AES.encrypt(valores.cpf,CHAVE_SECRETA).toString()
        }

        if(valores.cnh){
            dadosAtualizados.cnh = cryptoJs.AES.encrypt(valores.cnh,CHAVE_SECRETA).toString()
        }

        await Motorista.update(dadosAtualizados,{where:{codMotorista:id}})
        return res.status(200).json({message:'Motorista atualizado com sucesso!'})
    }catch(err){
        console.error('Erro ao atualizar motorista:',err)
        return res.status(500).json({message:'Erro ao atualizar motorista!'})
    }
}

const apagar = async(req,res)=>{
    const id = req.params.id

    try{
        const motorista = await Motorista.findByPk(id)
        if(!motorista){
            return res.status(404).json({message:'Motorista não encontrado!'})
        }

        await Motorista.destroy({where:{codMotorista:id}})
        return res.status(200).json({message:'Motorista excluído com sucesso!'})
    }catch(err){
        console.error('Erro ao apagar motorista:',err)
        return res.status(500).json({message:'Erro ao apagar motorista!'})
    }
}

module.exports = {cadastrar, listar, consultarPorCod, consultarPorNome, atualizar, apagar}
