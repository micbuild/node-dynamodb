const Joi = require('joi');

module.exports = {
  query: Joi.object({
    email: Joi.string().required(),
    before: Joi.date().iso(),
    after: Joi.date().iso(),
    offset: Joi.number().integer().default(0),
    limit: Joi.number().integer().default(20)
  }).required().label('body')
};
