const Joi = require('joi');

module.exports = {
  body: Joi.object({
    wbcCount: Joi.number().required(),
    rbcCount: Joi.number().required(),
    hemoglobin: Joi.number().required(),
    hematrocit: Joi.number().required(),
    mcv: Joi.number().required(),
    mch: Joi.number().required(),
    mchc: Joi.number().required(),
    rdwCv: Joi.number().required(),
    plateletCount: Joi.number().required(),
    mpv: Joi.number().required()
  }).required().label('body')
};
