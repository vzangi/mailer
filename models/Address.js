const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')
const DeliveryGroup = require('./DeliveryGroup')
const AddressGroup = require('./AddressGroup')

const Address = sequelize.define(
    'addresses',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        client: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        scopes: {
            withGroups: {
                attributes: [
                    'id', 'client', 'email'
                ],
                include: [{
                    model: DeliveryGroup,
                    through: { attributes: [] }
                }],
            }
        }
    }
)

Address.belongsToMany(DeliveryGroup, { through: 'addressGroups' })
DeliveryGroup.belongsToMany(Address, { through: 'addressGroups' })

module.exports = Address