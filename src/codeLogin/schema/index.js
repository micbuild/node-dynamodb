const Joi = require('joi');

module.exports = {
  query: Joi.object({
    code: Joi.string().required(),
    state: Joi.string().required()
  }).required().label('query')
};
