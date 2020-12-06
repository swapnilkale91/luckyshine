const constants = require('../utilities/constants.js');
module.exports = class Validation {
    constructor(dependencies) {
        this.dependencies = dependencies;
        this.httpStatusCodes = dependencies[constants.HTTP_STATUS_CODES];
    }

    validateDistance(property, value) {
        if (value !== 1 && value !== 10) {
            throw Error('Distance should be either 1 km or 10 kms');
        }
    }

    validatePrizeValue(property, value) {

        if (!Number.isInteger(value)) {
            throw Error('Prize value should be a whole number');
        }
        if (value < 10 || value > 30) {
            throw Error('Prize value should be in the range of 10 to 30');
        }
    }

    _validateTreasureProperty(property, value) {
        switch (property) {
            case constants.LATITUDE: break;
            case constants.LONGITUDE: break;
            case constants.DISTANCE:
                this.validateDistance(property, value);
                break;
            case constants.PRIZEVALUE:
                this.validatePrizeValue(property, value);
                break;
            default: throw Error(constants.INVALID_PROP_FILE(property));
        }
    }
    mandatoryCheckTreasureProperties(requestPayload) {
        if (!(requestPayload[constants.LATITUDE] && requestPayload[constants.LONGITUDE] && requestPayload[constants.DISTANCE])) {
            throw Error(constants.MANDATORY_TREASURE_PROPS());
        }
    }

    validateTreasureProperties(requestPayload) {
        this.mandatoryCheckTreasureProperties(requestPayload);

        for (const attr in requestPayload) {
            if (requestPayload.hasOwnProperty(attr)) {
                this._validateTreasureProperty(attr, requestPayload[attr]);
            }
        }
    }

    validateFile(req) {
        console.log('validating excel file...');
        if (!req.file) {
            throw Error(constants.BAD_FILE);
        }
    }
};
