const { Router } = require('express');
const bodyParser = require('body-parser');
const { CREATED } = require('http-status');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //'sk_test_QwUSDVd9AYBQmOLJavAmAEeF');

const {
  middlewares: { express: mongoMiddlewares },
  connectors: { BaseMongoConnector }
} = require('@leif.nambara/mongo-connector');
const schemaValidationGenerator = require('@leif.nambara/express-schema-validation');

const StripeConnector = require('./connectors/stripe');
const schema = require('./schema');
const Model = require('./model');

const router = Router();

router.post(
  `/orders`,
  bodyParser.json(),
  schemaValidationGenerator(schema),
  mongoMiddlewares.preRequest,
  async (req, res, next) => {
    let err;
    try {
      const {
        locals: {
          logger, mongodb,
          schemaConvertionResult: { body }
        }
      } = res;

      const connectors = {
        stripe: new StripeConnector({ stripe }),
        db: new BaseMongoConnector({
          logger,
          db: mongodb.db(process.env.MONGO_DB_NAME || 'project'),
          collectionName: process.env.MONGO_DB_ORDERS_COLLECTION_NAME || 'orders'
        })
      };

      const model = new Model({ logger, connectors });

      const id = await model.create({
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
