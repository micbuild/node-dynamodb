const express = require('express');
const cors = require('cors');

const {
  setupRequestLogger,
  requestLogger,
  responseLogger,
  init: initLogger,
} = require('@leif.nambara/express-logger');
const { middlewares: { express: { errorHandler } } } = require('@leif.nambara/errors');
const notFoundHandler = require('@leif.nambara/express-not-found-handler');
const healthcheck = require('@leif.nambara/express-healthcheck');
const httpRequestsMiddlewares = require('@leif.nambara/express-http-connector');

const pkg = require('../package.json');

const configMiddleware = require('./common/config/middleware');
const docsRoute = require('./common/docs/route');

const post = require('./post');
const getStatus = require('./getStatus');
const codeLogin = require('./codeLogin');
const postOrders = require('./postOrders');

const app = express();

app.locals.pkg = pkg;
app.locals.name = process.env.SERVICE_NAME || app.locals.pkg.name;

configMiddleware.init(app);
initLogger(app);

/* middlewares - initialization */
httpRequestsMiddlewares.init(app);
/* middlewares - initialization */

/* middlewares - pre routes */
app.use(cors());
app.use(setupRequestLogger);
app.use(requestLogger);
app.use(httpRequestsMiddlewares.preRequest);
app.use(healthcheck);
/* middlewares - pre routes */

/* routes */
app.use(docsRoute);
app.use(post);
app.use(getStatus);
app.use(codeLogin);
app.use(postOrders);
/* routes */

/* middlewares - post routes */
app.use(notFoundHandler);
app.use(errorHandler);
app.use(responseLogger);
/* middlewares - post routes */

const { locals: { config, logger } } = app;
app.listen(config.port, () => {
  logger.info(`${config.name} is listening on ${config.host}:${config.port}`);
});
