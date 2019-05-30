const { Router } = require('express');
const bodyParser = require('body-parser');
const { OK } = require('http-status');

const schemaValidationGenerator = require('@leif.nambara/express-schema-validation');

const {
  middlewares: { express: mongoMiddlewares },
  connectors: { BaseMongoConnector }
} = require('@leif.nambara/mongo-connector');

const auth = require('../common/auth');

const CbcDbConnector = require('./connectors/db/cbc');
const Model = require('./model');

const schema = require('./schema');

const router = Router();

const path = 'project/getStatus';

router.post(
  `/${path}`,
  bodyParser.json(),
  auth.preRequest,
  schemaValidationGenerator(schema),
  mongoMiddlewares.preRequest,
  async (req, res, next) => {
    let err;
    try {
      const {
        locals: {
          logger, mongodb,
          auth: { sub },
          schemaConvertionResult: { body }
        }
      } = res;

      const connectors = {
        db: {
          cbc: new CbcDbConnector({
            logger,
            db: mongodb.db(process.env.MONGO_DB_NAME || 'project'),
            collectionName: process.env.MONGO_DB_CBC_COLLECTION_NAME || 'cbc'
          }),
          markers: new BaseMongoConnector({
            logger,
            db: mongodb.db(process.env.MONGO_DB_NAME || 'project'),
            collectionName: process.env.MONGO_DB_MARKER_COLLECTION_NAME || 'markers'
          })
        }
      };
      const model = new Model({ logger, connectors });

      const result = await model.get({
        userId: sub,
        ...body
      });
      res.status(OK).send(result);
    } catch (e) {
      err = e;
    }
    return next(err);
  },
  mongoMiddlewares.postResponse
);

module.exports = router;
