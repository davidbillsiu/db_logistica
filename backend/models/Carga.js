const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Carga = db.define('carga',{
    codCarga:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    descricao:{
        type:DataTypes.STRING(100),
        allowNull:false
    },
    peso:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    volume:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    codRastreio:{
        type:DataTypes.INTEGER,
        allowNull:false,
        unique:true
    },
    idMotorista:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'motoristas',
            key:'codMotorista'
        }
    }
},{
    timestamps:false,
    tableName:'cargas'
})

module.exports = Carga
