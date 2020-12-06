const treasureRepository = require('../repository/repository');
const readXlsxFile = require('read-excel-file/node');

module.exports = class TreasureService {

    constructor(dependencies) {
        this.postTreasure = this.postTreasure.bind(this);
        this.getTreasures = this.getTreasures.bind(this);
        this._extractDataFromExcel = this._extractDataFromExcel.bind(this);
        this.uploadExcelFile = this.uploadExcelFile.bind(this);
        this._convertRawDataToObjects = this._convertRawDataToObjects.bind(this);
        this._saveObjectsToDB = this._saveObjectsToDB.bind(this);
        this.treasurerepository = new treasureRepository(dependencies);
    }

    async postTreasure(treasureid, reqbody) {
        return await this.treasurerepository.postTreasure(treasureid, reqbody);
    }

    async getTreasures(reqbody) {
        return await this.treasurerepository.getTreasures(reqbody);
    }

    async _convertRawDataToObjects(rawexceldata) {
        const treasurerows = rawexceldata[0];
        const userrows = rawexceldata[1];
        const moneyvaluerows = rawexceldata[2];
        const treasures = [];
        const users = [];
        const moneyvalues = [];

        // removing header row
        treasurerows.shift();
        userrows.shift();
        moneyvaluerows.shift();

        treasurerows.forEach(treasurerow => {
            const treasureobj = {
                'id': treasurerow[0],
                'latitude': treasurerow[1],
                'longitude': treasurerow[2],
                'name': treasurerow[3]
            };
            treasures.push(treasureobj);
        });

        userrows.forEach(user => {
            const userobj = {
                'id': user[0],
                'name': user[1],
                'age': user[2],
                'password': user[3],
                'email': user[4]
            };
            users.push(userobj);
        });

        moneyvaluerows.forEach(moneyvaluerow => {
            const moneyvalueobj = {
                'treasure_id': moneyvaluerow[0],
                'amt': moneyvaluerow[1]
            };
            moneyvalues.push(moneyvalueobj);
        });

        return [treasures, users, moneyvalues];
    }

    async _extractDataFromExcel(path) {
        const readfromexcel = [];
        readfromexcel.push(readXlsxFile(path, { 'sheet': 'treasures' }));
        readfromexcel.push(readXlsxFile(path, { 'sheet': 'users' }));
        readfromexcel.push(readXlsxFile(path, { 'sheet': 'money_values' }));

        return await Promise.all(readfromexcel);
    }

    async _saveObjectsToDB(objarrays) {
        return this.treasurerepository.saveObjectsToDB(objarrays);
    }

    async uploadExcelFile(path) {
        const rawexceldata = await this._extractDataFromExcel(path);
        const objarray = await this._convertRawDataToObjects(rawexceldata);

        return await this._saveObjectsToDB(objarray);
    }
};
