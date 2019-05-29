const { Router } = require('express');
const bodyParser = require('body-parser');
const { OK } = require('http-status');

const schemaValidationGenerator = require('@leif.nambara/express-schema-validation');

const Auth = require('./connectors/auth');
const Model = require('./model');

const schema = require('./schema');

const router = Router();

const path = 'code-login';

router.get(
  `/${path}`,
  bodyParser.json(),
  schemaValidationGenerator(schema),
  async (req, res, next) => {
    let err;
    try {
      const {
        locals: {
          logger, mongodb,
          // auth: { sub },
          schemaConvertionResult: { query }
        }
      } = res;

      const connectors = {
        auth: new Auth({
          request: res.locals.request,
          config: {
            baseUrl: process.env.AUTH_COGNITO_BASE_URL,
            clientId: process.env.AUTH_COGNITO_CLIENT_ID,
            clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET,
            redirectUri: process.env.AUTH_COGNITO_REDIRECT_URI
          }
        })
      };
      const model = new Model({ logger, connectors });

      const tokens = await model.getToken({
        // customerId: sub,
        ...query
      });
      res.status(OK).send({ ...tokens });
    } catch (e) {
      err = e;
    }
    return next(err);
  }
);

module.exports = router;
