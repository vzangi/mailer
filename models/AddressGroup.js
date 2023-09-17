const sequelize = require('../utils/db')

const AddressGroup = sequelize.define(
    'addressGroups',
    {},
    {
        timestamps: false
    }
)

module.exports = AddressGroup