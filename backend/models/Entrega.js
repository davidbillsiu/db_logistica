const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Entrega = db.define('entrega',{
    codEntrega:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    cidade:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM('ENTREGUE','TRANSITO'),
        allowNull:false
    },
    data:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    hora:{
        type:DataTypes.TIME,
        allowNull:false
    },
    idCarga:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'cargas',
            key:'codCarga'
        }
    }
},{
    timestamps:false,
    tableName:'entregas'
})

module.exports = Entrega
