const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customers = require('./customer.model')(sequelize, Sequelize);
db.contacts = require('./contact.model')(sequelize, Sequelize);
db.customers.hasOne(db.contacts, { onDelete: 'CASCADE' })
db.contacts.belongsTo(db.customers)
// db.contacts.belongsTo(db.customers, { as: 'Contact', foreignKey: 'fk_customerid', targetKey: 'uuid' })

module.exports = db;