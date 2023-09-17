const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require('../utils/db')
const User = require('./User')
const Template = require('./Template')
const Transport = require('./Transport')
const GroupDelivery = require('./GroupDelivery')
const DeliveryGroup = require('./DeliveryGroup')
const { coolDate } = require('../utils/dates')

const statusNames = [
    'Ожидает запуска',   // 0
    'Запущена',          // 1
    'Приостановлена',    // 2
    'Завершена',         // 3
]

const statuses = {
    PENDING: 0,
    LAUNCHED: 1,
    SUSPENDED: 2,
    COMPLETED: 3
}

const Delivery = sequelize.define(
    'deliveries',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        templateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING,
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        sended: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lastAddressId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        statusName: {
            type: DataTypes.VIRTUAL(DataTypes.STRING),
            get() {
                return statusNames[this.status]
            },
            set() {
                throw new Error('Это поле нельзя изменять')
            }
        },
        makeDate: {
            type: DataTypes.VIRTUAL(DataTypes.STRING),
            get() {
                return coolDate(this.createdAt)
            },
            set() {
                throw new Error('Это поле нельзя изменять')
            }
        }
    },
    {
        defaultScope: {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name']
                },
                {
                    model: Template,
                    attributes: ['id', 'name']
                },
                {
                    model: Transport,
                    attributes: ['id', 'sender', 'username']
                },
                {
                    model: GroupDelivery,
                    as: 'groups',
                    include: [
                        {
                            model: DeliveryGroup
                        }
                    ]
                }
            ]
        },
        scopes: {
            mailer: {
                include: [Template, Transport]
            }
        }
    }
)

Delivery.statusNames = statusNames
Delivery.statuses = statuses

Delivery.belongsTo(User)
Delivery.belongsTo(Template)
Delivery.belongsTo(Transport)
Delivery.hasMany(GroupDelivery, { as: 'groups' })

module.exports = Delivery