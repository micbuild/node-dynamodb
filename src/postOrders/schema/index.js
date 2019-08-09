const Joi = require('joi');

module.exports = {
  body: Joi.object({
    type: Joi.valid('regular', 'subscription').required(),
    productId: Joi.string().required(),
    shippingAddress: Joi.object().required(),
    email: Joi.string().required(),
    orderId: Joi.string().required(),
    status: Joi.string().required(),
    price: Joi.number().required()
  }).required().label('body')
};
