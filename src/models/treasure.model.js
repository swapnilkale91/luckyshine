module.exports = (sequelize, Sequelize) => {
    const treasures = sequelize.define('treasures', {
      'id': {
        'type': Sequelize.INTEGER,
        'primaryKey': true
      },
      'latitude': {
        'type': Sequelize.DOUBLE
      },
      'longitude': {
        'type': Sequelize.DOUBLE
      },
      'name': {
        'type': Sequelize.STRING
      }
    }, {
      'timestamps': false
    });

    return treasures;
  };
