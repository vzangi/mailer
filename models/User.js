const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')

const User = sequelize.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
        }
    }
)

User.SUPER = 1
User.ADMIN = 2
User.USER = 3
User.GUEST = 4

module.exports = User