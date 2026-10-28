const Carga = require('../models/Carga')
const Motorista = require('../models/Motorista')

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.descricao || !valores.peso || !valores.volume || !valores.codRastreio || !valores.idMotorista){
        return res.status(400).json({message:'Todos os campos (descricao, peso, volume, codRastreio, idMotorista) são obrigatórios!'})
    }

    if(isNaN(Number(valores.codRastreio))){
        return res.status(400).json({message:'O código de rastreio deve ser numérico!'})
    }

    try{
        const motorista = await Motorista.findByPk(valores.idMotorista)
        if(!motorista){
            return res.status(404).json({message:'Motorista informado não existe!'})
        }

        const novaCarga = await Carga.create(valores)
        return res.status(201).json({message:'Carga cadastrada com sucesso!', carga:novaCarga})
    }catch(err){
        console.error('Erro ao cadastrar carga:',err)
        return res.status(500).json({message:'Erro ao cadastrar carga!'})
    }
}

module.exports = {cadastrar}
