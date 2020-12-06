const chai = require('chai');
const expect = chai.expect;
const treasureController = require('../../../src/controllers/controller');
const treasureService = require('../../../src/services/service');
const constants = require('../../../src/utilities/constants');
const sinon = require('sinon');
const httpCodes = require('http-status-codes');
const express = require('express');
const app = express();
const dependencies = {};
dependencies[constants.HTTP_STATUS_CODES] = httpCodes;

describe('treasure controller test cases', () => {

    beforeEach(() => {
        treasureServicepostTreasureStub = sinon.stub(treasureService.prototype, 'postTreasure');
        treasureServicegetTreasureStub = sinon.stub(treasureService.prototype, 'getTreasures');
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
    });

    afterEach(() => {
        treasureServicepostTreasureStub.restore();
        treasureServicegetTreasureStub.restore();
    });

    it('should call postTreasure service function and unlock treasure', async () => {
        const result = new Array();
        result.push({ 'status': 1 });
        treasureServicepostTreasureStub.resolves(result);
        const response = await new treasureController(app, dependencies).postTreasure(req, res);
        sinon.assert.calledOnce(treasureServicepostTreasureStub);
        sinon.assert.calledWith(res.status, httpCodes.OK);
    });

    it('should call postTreasure service function and get error', async () => {
        const result = new Array();
        result.push({ 'status': 2 });
        treasureServicepostTreasureStub.resolves(result);
        const response = await new treasureController(app, dependencies).postTreasure(req, res);
        sinon.assert.calledOnce(treasureServicepostTreasureStub);
        sinon.assert.calledWith(res.status, httpCodes.INTERNAL_SERVER_ERROR);
    });

    it('should call getTreasure service function and return success', async () => {
        req = {
            'body': {
                'latitude': 1.33125924,
                'longitude': 103.89804864,
                'distance': 10,
                'prizevalue': 15
            }
        };

        result = [{
            'name': 'T12',
            'amount': 15,
            'distance': 7.097690233333524
        }];

        treasureServicegetTreasureStub.resolves(result);
        const response = await new treasureController(app, dependencies).getTreasures(req, res);
        sinon.assert.calledOnce(treasureServicegetTreasureStub);
    });

    it('should call getTreasure service function and throw error', async () => {
        req = {
            'body': {
                'latitude': 1.33125924,
                'longitude': 103.89804864,
                'distance': 10,
                'prizevalue': 15
            }
        };

        treasureServicegetTreasureStub.resolves(new Error());
        const response = await new treasureController(app, dependencies).getTreasures(req, res);
        sinon.assert.calledOnce(treasureServicegetTreasureStub);
    });
});
