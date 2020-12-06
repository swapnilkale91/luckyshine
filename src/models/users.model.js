module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define('users', {
      'id': {
        'type': Sequelize.INTEGER,
        'primaryKey': true
      },
      'name': {
        'type': Sequelize.STRING
      },
      'age': {
        'type': Sequelize.INTEGER
      },
      'password': {
        'type': Sequelize.STRING
      },
      'email': {
        'type': Sequelize.STRING,
        'unique': true
      },
      'points': {
        'type': Sequelize.INTEGER,
        'defaultValue': '0'
      }
    }, {
      'timestamps': false
    });

    return Users;
  };
