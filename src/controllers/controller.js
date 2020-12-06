const validation = require('../validations/validations.js');
const upload = require('../middlewares/upload');
const service = require('../services/service');
const constants = require('../utilities/constants');

module.exports = class TreasureController {

  constructor(app, dependencies) {
    this.app = app;
    this.httpCodes = dependencies[constants.HTTP_STATUS_CODES];
    this.validations = new validation(dependencies);
    this.uploadExcelFile = this.uploadExcelFile.bind(this);
    this.getTreasures = this.getTreasures.bind(this);
    this.postTreasure = this.postTreasure.bind(this);
    this.treasureservice = new service(dependencies);

    this.registerRoutes();
  }

  registerRoutes() {
    this.app.route('/uploadExcel')
      .post(upload.single('file'), this.uploadExcelFile);
    this.app.route('/treasures')
      .post(this.getTreasures);
    this.app.route('/treasures/:id')
      .post(this.postTreasure);
  }

  async uploadExcelFile(req, res) {
    try {
      if (!req.file) {
        return res.status(this.httpCodes.BAD_REQUEST).send('Please upload an excel file!');
      }

      const excelfilesavedpath = global.__basedir + '/uploads/' + req.file.filename;
      await this.treasureservice.uploadExcelFile(excelfilesavedpath);

      res.status(this.httpCodes.OK).send({
        'message': 'Uploaded the file successfully: ' + req.file.originalname
      });
    } catch (error) {
      console.error(error);
      res.status(this.httpCodes.INTERNAL_SERVER_ERROR).send({
        'message': 'Could not upload the file: ' + req.file.originalname,
        'error': error.message
      });
    }
  }

  async postTreasure(req, res) {
    try {
      const treasureid = req.params.id;
      const procresult = await this.treasureservice.postTreasure(treasureid, req.body);

      if (procresult[0].status === 1) {
        res.status(this.httpCodes.OK).send({ 'message': 'Treasure unlocked' });
      } else if (procresult[0].status === 2) {
        res.status(this.httpCodes.INTERNAL_SERVER_ERROR).send({ 'message': 'Wait for a while !' });
      } else {
        res.status(this.httpCodes.INTERNAL_SERVER_ERROR).send({ 'message': 'Good Try ! Move closer to the treasure or look for other ones' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getTreasures(req, res) {
    try {
      this.validations.validateTreasureProperties(req.body);
      let treasures = await this.treasureservice.getTreasures(req.body);
      treasures = treasures.map(treasure => ({ 'name': treasure.name, 'amount': treasure.amount, 'distance': treasure.distance }));
      res.send(treasures);
    } catch (error) {
      res.status(this.httpCodes.INTERNAL_SERVER_ERROR).send({
        'message': error.message || 'Some error occurred while retrieving treasure boxes.'
      });
    }
  }
};
