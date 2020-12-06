const { treasuredb, userdb, moneyvaluesdb, sequelizedb } = require('../models');
const { QueryTypes } = require('sequelize');

module.exports = class TreasureRepository {

    constructor(dependencies) {
        this.postTreasure = this.postTreasure.bind(this);
        this.getTreasures = this.getTreasures.bind(this);
        this.saveObjectsToDB = this.saveObjectsToDB.bind(this);
    }

    async saveObjectsToDB(objarrays) {
        const treasuresarray = objarrays[0];
        const usersarray = objarrays[1];
        const moneyvaluesarray = objarrays[2];

        const saveObjToDB = [];
        saveObjToDB.push(treasuredb.bulkCreate(treasuresarray));
        saveObjToDB.push(userdb.bulkCreate(usersarray));
        saveObjToDB.push(moneyvaluesdb.bulkCreate(moneyvaluesarray));

        return await Promise.all(saveObjToDB);
    }

    async postTreasure(treasureid, reqbody) {
        const latitude = reqbody.latitude;
        const longitude = reqbody.longitude;
        const email = reqbody.email;
        const amount = reqbody.amount;

        return await sequelizedb.query(`call Open_Treasure (:treasureid, :amount, :latitude, :longitude, :email)`,
            { 'replacements': { 'treasureid': treasureid, 'amount': amount, 'latitude': latitude, 'longitude': longitude, 'email': email } });
    }

    async getTreasures(reqbody) {
        return await sequelizedb.query(
            `SELECT * from
              (SELECT min(m.amt) as amount, t.id, t.name, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) *
                cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) *
                sin( radians( latitude ) ) ) ) AS distance
            FROM treasures t, money_values m
                where t.id = m.treasure_id
                and m.opened = false
                group by t.id
                HAVING  distance < ? ORDER BY distance) t
            where t.amount = COALESCE(?, t.amount) order by t.name`,
            {
                'replacements': [reqbody.latitude, reqbody.longitude, reqbody.latitude, reqbody.distance, reqbody.prizevalue],
                'type': QueryTypes.SELECT
            }
        );
    }
};
