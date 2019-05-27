require('dotenv').config();

const init = app => {
  const { locals: { name } } = app;
  app.locals.config = {
    name,
    host: process.env.SERVICE_HOST || '0.0.0.0',
    port: parseInt(process.env.SERVICE_PORT || '3000', 10),
    logger: {
      name,
      level: process.env.LOG_LEVEL || 'trace'
    }
  };
};

module.exports = {
  init
};
