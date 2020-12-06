module.exports = (sequelize, Sequelize) => {
    const MoneyValues = sequelize.define('money_values', {
      'id' : {
        'type': Sequelize.INTEGER,
        'autoIncrement': true,
        'primaryKey': true
      },
      'treasure_id': {
        'type': Sequelize.INTEGER,
        'references': {
          'model': 'treasures',
          'key': 'id'
        }
      },
      'amt': {
        'type': Sequelize.INTEGER
      },
      'opened': {
        'type': Sequelize.BOOLEAN,
        'defaultValue': false
      }
    }, {
      'timestamps': false
    });

    return MoneyValues;
  };
