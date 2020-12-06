const dbConfig = require('../../config/dbConfig.js');
console.log('1');
const Sequelize = require('sequelize');
const sequelizedb = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  'host': dbConfig.HOST,
  'dialect': dbConfig.dialect,
  'operatorsAliases': false,

  'pool': {
    'max': dbConfig.pool.max,
    'min': dbConfig.pool.min,
    'acquire': dbConfig.pool.acquire,
    'idle': dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelizedb = sequelizedb;
db.treasuredb = require('./treasure.model.js')(sequelizedb, Sequelize);
db.userdb = require('./users.model.js')(sequelizedb, Sequelize);
db.moneyvaluesdb = require('./money-values.model.js')(sequelizedb, Sequelize);
db.procedure = require('./procedure.js')(sequelizedb, Sequelize);

module.exports = db;
