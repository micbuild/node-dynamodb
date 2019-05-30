const Joi = require('joi');

module.exports = {
  body: Joi.object({
  }).required().label('body')
};
