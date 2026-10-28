const Entrega = require('../models/Entrega')
const Carga = require('../models/Carga')

const STATUS_VALIDOS = ['ENTREGUE','TRANSITO']

const cadastrar = async(req,res)=>{
    const valores = req.body

    if(!valores.cidade || !valores.status || !valores.data || !valores.hora || !valores.idCarga){
        return res.status(400).json({message:'Todos os campos (cidade, status, data, hora, idCarga) são obrigatórios!'})
    }

    if(!STATUS_VALIDOS.includes(valores.status)){
        return res.status(400).json({message:'Status inválido! Use ENTREGUE ou TRANSITO.'})
    }

    try{
        const carga = await Carga.findByPk(valores.idCarga)
        if(!carga){
            return res.status(404).json({message:'Carga informada não existe!'})
        }

        const novaEntrega = await Entrega.create(valores)
        return res.status(201).json({message:'Entrega registrada com sucesso!', entrega:novaEntrega})
    }catch(err){
        console.error('Erro ao cadastrar entrega:',err)
        return res.status(500).json({message:'Erro ao cadastrar entrega!'})
    }
}

const atualizar = async(req,res)=>{
    const id = req.params.id
    const valores = req.body

    try{
        const entrega = await Entrega.findByPk(id)
        if(!entrega){
            return res.status(404).json({message:'Entrega não encontrada!'})
        }

        if(valores.status && !STATUS_VALIDOS.includes(valores.status)){
            return res.status(400).json({message:'Status inválido! Use ENTREGUE ou TRANSITO.'})
        }

        if(valores.idCarga){
            const carga = await Carga.findByPk(valores.idCarga)
            if(!carga){
                return res.status(404).json({message:'Carga informada não existe!'})
            }
        }

        await Entrega.update(valores,{where:{codEntrega:id}})
        return res.status(200).json({message:'Entrega atualizada com sucesso!'})
    }catch(err){
        console.error('Erro ao atualizar entrega:',err)
        return res.status(500).json({message:'Erro ao atualizar entrega!'})
    }
}

const listar = async(req,res)=>{
    try{
        const entregas = await Entrega.findAll({
            order:[['data','ASC'],['hora','ASC']],
            include:[
                {
                    model:Carga,
                    as:'cargaEntrega',
                    attributes:['codCarga','descricao','peso','volume','codRastreio']
                }
            ]
        })

        return res.status(200).json(entregas)
    }catch(err){
        console.error('Erro ao listar entregas:',err)
        return res.status(500).json({message:'Erro ao listar entregas!'})
    }
}

module.exports = {cadastrar, atualizar, listar}
