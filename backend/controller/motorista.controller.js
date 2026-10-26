const Motorista = require('../models/Motorista')

const cryptoJs = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.nome || !valores.cnh || !valores.cpf || !valores.telefone){
        return res.status(404).json({message:'Preencha todos os dados'})
    }

    if(valores.cpf.length !== 11){
        return res.status(404).json({message:'cpf inválido'})
    }

    try{
        const cnhCriptografado = cryptoJs.AES.encrypt(valores.cnh,CHAVE_SECRETA).toString()
        const cpfCriptografado = cryptoJs.AES.encrypt(valores.cpf,CHAVE_SECRETA).toString()


        await Motorista.create({
            nome:valores.nome,
            cnh:cnhCriptografado,
            cpf:cpfCriptografado,
            telefone:valores.telefone
        })
        return res.status(201).json({message:'Dados Cadastrados com sucesso'})
    }catch(err){
        return res.status(500).json({message:'Erro ao cadastrar'})
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
                const bytes = cryptoJs.AES.decrypt(el.cpf,CHAVE_SECRETA)
                const bytes1 = cryptoJs.AES.decrypt(el.cnh,CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)
                cnhDescriptografada = bytes1.toString(cryptoJs.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codMotorista:el.codMotorista,
                nome:el.nome,
                email:el.email,
                cnh:cnhDescriptografada,
                cpf:cpfDescriptografado,
                telefone:el.telefone
                
            })
        })
    }catch(err){
        return res.status(500).json({message:'Não foi possível listar'})
    }
}

const consultarPorCod = async(req,res)=>{
    const id = req.params.id

    try{
        const motorista = await Motorista.findByPk(id)

        if(!motorista){
            return res.status(404).json({message:'Motorista Inexistente'})
        }

        const bytes = cryptoJs.AES.decrypt(motorista.cpf,CHAVE_SECRETA)
        const bytes1 = cryptoJs.AES.decrypt(motorista.cnh,CHAVE_SECRETA)

        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)
        const cnhDescriptografada = bytes1.toString(cryptoJs.enc.Utf8)

        return res.status(200).json({
            codMotorista:motorista.codMotorista,
                nome:motorista.nome,
                email:motorista.email,
                cnh:cnhDescriptografada,
                cpf:cpfDescriptografado,
                telefone:motorista.telefone
        })
    }catch(err){
        return res.status(500).json({message:'erro ao consultar'})
    }
}

consultarPorNome = async(req,res)=>{
    const nome = req.params.nome

    try{
        const motorista = await Motorista.findOne({where:{nome:nome}})

        if(!motorista){
            return res.status(404).json({message:'nome inexistente'})
        }

        const bytes = cryptoJs.AES.decrypt(motorista.cpf,CHAVE_SECRETA)
        const bytes1 = cryptoJs.AES.decrypt(motorista.cnh,CHAVE_SECRETA)

        const cpfDescriptografado = bytes.toString(cryptoJs.enc.Utf8)
        const cnhDescriptografada = bytes1.toString(cryptoJs.enc.Utf8)


        return res.status(200).json({
            codMotorista:motorista.codMotorista,
                nome:motorista.nome,
                email:motorista.email,
                cnh:cnhDescriptografada,
                cpf:cpfDescriptografado,
                telefone:motorista.telefone
        })
    }catch(err){
        return res.status(500).json({message:'Não foi possível buscar por nome'})
    }
}

const atualizar = async(req,res)=>{
     const id = req.params.id
    const valores = req.body

    try {
        const motorista = await Motorista.findByPk(id)
        if (!motorista) {
            return res.status(404).json({ message: 'Motorista não encontrado!' })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O CPF deve conter exatamente 11 dígitos!' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.cnh) {
            dadosAtualizados.cnh = CryptoJS.AES.encrypt(valores.cnh, CHAVE_SECRETA).toString()
        }

        await Motorista.update(dadosAtualizados, { where: { codMotorista: id } })
        return res.status(200).json({ message: 'Motorista atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar Motorista:', err)
        return res.status(500).json({ message: 'Erro ao atualizar Motorista!' })
    }
}

const apagar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const motorista = await Motorista.findByPk(id)

        if(!motorista){
            return res.status(404).json({message:'id inexistente'})
        }

        await Motorista.destroy({where:{codMotorista:id}})
        return res.status(200).json({message:'Dados Excluídos com sucesso'})
    }catch(err){
        return res.status(500).json({message:'Não foi possível excluir'})
    }
}

module.exports = {cadastrar, listar, consultarPorCod, consultarPorCod, atualizar, apagar }