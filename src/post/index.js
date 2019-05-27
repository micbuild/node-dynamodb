const { Router } = require('express');
const bodyParser = require('body-parser');
const { CREATED } = require('http-status');

const schemaValidationGenerator = require('@leif.nambara/express-schema-validation');

const {
  middlewares: { express: mongoMiddlewares },
  connectors: { BaseMongoConnector }
} = require('@leif.nambara/mongo-connector');

const DbConnector = require('./connectors/db');
const Model = require('./model');

const schema = require('./schema');

const router = Router();

const path = 'project/ccb';

router.post(
  `/${path}`,
  bodyParser.json(),
  schemaValidationGenerator(schema),
  mongoMiddlewares.preRequest,
  async (req, res, next) => {
    let err;
    try {
      const {
        locals: {
          logger, mongodb,
          // auth: { sub },
          schemaConvertionResult: { body }
        }
      } = res;

      const connectors = {
        db: new BaseMongoConnector({
          logger,
          db: mongodb.db(process.env.MONGO_DB_NAME || 'project'),
          collectionName: process.env.MONGO_DB_COLLECTION_NAME || 'ccb'
        })
      };
      const model = new Model({ logger, connectors });

      const id = await model.create({
        // customerId: sub,
        ...body
      });
      res.status(CREATED).send({ id });
    } catch (e) {
      err = e;
    }
    return next(err);
  },
  mongoMiddlewares.postResponse
);

module.exports = router;
