const Joi = require('joi');

module.exports = {
  body: Joi.object({
    type: Joi.valid('onetime', 'subscription').required(),
    productId: Joi.string(),
    productName: Joi.string(),
    customer: Joi.string(),
    shippingAddress: Joi.object(),
    email: Joi.string(),
    orderId: Joi.string().required(),
    status: Joi.string().required(),
    price: Joi.number().required()
  }).required().label('body')
};
