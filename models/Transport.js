const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')

const Transport = sequelize.define(
    'transports',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sender: {
            type: DataTypes.STRING,
        }
    }
)

module.exports = Transport