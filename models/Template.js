const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')

const Template = sequelize.define(
    'templates',
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
        },
        html: {
            type: DataTypes.TEXT,
        }
    }
)

module.exports = Template