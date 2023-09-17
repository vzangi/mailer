const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')
const Delivery = require('./Delivery')
const DeliveryGroup = require('./DeliveryGroup')

const GroupDelivery = sequelize.define(
    'groupDeliveries',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        deliveryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deliveryGroupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        timestamps: false
    }
)

//GroupDelivery.belongsTo(Delivery)
GroupDelivery.belongsTo(DeliveryGroup)

module.exports = GroupDelivery