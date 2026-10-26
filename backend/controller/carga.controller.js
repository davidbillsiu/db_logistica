const Carga = require('../models/Carga')


const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.descricao || !valores.peso || !valores.volume || !valores.codRastreio){
        return res.status(400).json({message:'Preencha todos os dados'})
    }
    try{
        await Carga.create(valores)
        return res.status(201).json({message:'Dados cadastrados'})
    }catch(err){
        return res.status(500).json({message:'Erro ao cadastrar'})
    }
}

module.exports = {cadastrar}