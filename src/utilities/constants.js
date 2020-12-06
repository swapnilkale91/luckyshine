module.exports.HTTP_STATUS_CODES = 'httpStatusCodes';

const LATITUDE = 'latitude';
const LONGITUDE = 'longitude';
const DISTANCE = 'distance';
const PRIZEVALUE = 'prizevalue';
const BAD_FILE = 'Please upload an excel file!';

module.exports.LATITUDE = LATITUDE;
module.exports.LONGITUDE = LONGITUDE;
module.exports.DISTANCE = DISTANCE;
module.exports.PRIZEVALUE = PRIZEVALUE;
module.exports.BAD_FILE = BAD_FILE;

const TREASURE_PROPERTIES = [LATITUDE, LONGITUDE, DISTANCE, PRIZEVALUE];

module.exports.MANDATORY_TREASURE_PROPS = () => `Latitude, Longitute and Distance are mandatory properties`;
module.exports.INVALID_PROP_FILE = prop => `Invalid property ${prop}. Valid properties are ${TREASURE_PROPERTIES}`;
