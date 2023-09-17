const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')

const DeliveryGroup = sequelize.define(
    'deliveryGroups',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false
    }
)

module.exports = DeliveryGroup