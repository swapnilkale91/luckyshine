const chai = require('chai');
const expect = chai.expect;
const treasureService = require('../../../src/services/service');
const treasureRepository = require('../../../src/repository/repository');
const constants = require('../../../src/utilities/constants');
const sinon = require('sinon');
const httpCodes = require('http-status-codes');
const express = require('express');
const app = express();
const dependencies = {};
dependencies[constants.HTTP_STATUS_CODES] = httpCodes;

describe('treasure service test cases', () => {

    beforeEach(() => {
        treasureRepositorypostTreasureStub = sinon.stub(treasureRepository.prototype, 'postTreasure');
        treasureRepositorygetTreasureStub = sinon.stub(treasureRepository.prototype, 'getTreasures');
        treasureRepositorysaveObjectsToDBStub = sinon.stub(treasureRepository.prototype, 'saveObjectsToDB');
        treasureService_extractDataFromExcelStub = sinon.stub(treasureService.prototype, '_extractDataFromExcel');
        treasureService_convertRawDataToObjectsStub = sinon.stub(treasureService.prototype, '_convertRawDataToObjects');
        treasureService_saveObjectsToDBStub = sinon.stub(treasureService.prototype, '_saveObjectsToDB');

        req = {
            'params': {
                'id': 1
            },
            'body': {
                'latitude': 1.32303589,
                'longitude': 103.87748154,
                'amount': 10,
                'email': 'u1@luckyshine.xyz'
            }
        };

        res = {
            'send': sinon.spy(),
            'json': sinon.spy(),
            'status': sinon.stub().returns({ 'send': sinon.stub().returns(true) })
        };

        result = [{
            'name': 'T12',
            'amount': 15,
            'distance': 7.097690233333524
        }];
    });

    afterEach(() => {
        treasureRepositorypostTreasureStub.restore();
        treasureRepositorygetTreasureStub.restore();
        treasureRepositorysaveObjectsToDBStub.restore();
        treasureService_extractDataFromExcelStub.restore();
        treasureService_convertRawDataToObjectsStub.restore();
        treasureService_saveObjectsToDBStub.restore();
    });

    it('should call postTreasure repository function and get results', async () => {
        const treasureid = 100;
        const response = await new treasureService().postTreasure(treasureid, req);
        sinon.assert.calledOnce(treasureRepositorypostTreasureStub);
    });

    it('should call getTreasure repository function and get results', async () => {
        req = {
            'body': {
                'latitude': 1.33125924,
                'longitude': 103.89804864,
                'distance': 10,
                'prizevalue': 15
            }
        };
        treasureRepositorygetTreasureStub.resolves(result);
        const response = await new treasureService(dependencies).getTreasures(req);
        sinon.assert.calledOnce(treasureRepositorygetTreasureStub);
    });

    it('should _extractDataFromExcel from service function', async () => {
        const path = '';
        const response = await new treasureService(dependencies)._extractDataFromExcel(path);
    });

    it('should _convertRawDataToObjects from service function', async () => {
        const rawexceldata = [{}, {}, {}];
        const response = await new treasureService(dependencies)._convertRawDataToObjects(rawexceldata);
    });

    it('should call uploadExcelFile repository function', async () => {
        const path = '';
        const result = [];
        treasureService_extractDataFromExcelStub.resolves(result);
        treasureService_convertRawDataToObjectsStub.resolves(result);
        const response = await new treasureService(dependencies).uploadExcelFile(path);
        sinon.assert.calledOnce(treasureService_extractDataFromExcelStub);
        sinon.assert.calledOnce(treasureService_convertRawDataToObjectsStub);
        sinon.assert.calledOnce(treasureService_saveObjectsToDBStub);
    });
});
