const Entrega = require('../models/Entrega')

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.cidade || !valores.status || !valores.data || !valores.hora){
        return res.status(404).json({message:'Preencha todos os dados'})
    }
try{
    await Entrega.create(valores)
    return res.status(201).json({message:'dados cadastrados'})
}catch(err){
    return res.status(500).json({message:'erro ao cadastrar'})
}
}

const listar = async(req,res)=>{
    try{
        const entrega = await Entrega.findAll()
        if(!entrega){
            return res.status(404).json({message:'dados inexistentes'})
        }
        return res.status(200).json(entrega)
    }catch(err){
        return res.status(500).json({message:'Erro ao listar'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const entrega = await Entrega.findAll(id)
        
        if(!entrega){
            return res.status(404).json({message:'id inexistente'})
        }

        await Entrega.update(valores, {where:{codEntrega:id}})
        return res.status(200).json({message:'dados atualizados'})
    }catch(err){
        return res.status(500).json({message:'Erro ao atualizar'})
    }
}

module.exports = {cadastrar, listar, atualizar}