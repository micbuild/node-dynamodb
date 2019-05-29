const CognitoExpress = require('cognito-express');
const { base: { UnauthorizedError } } = require('@leif.nambara/errors');

const preRequest = (req, res, next) => {
  cognitoExpress = new CognitoExpress({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    cognitoUserPoolId: process.env.COGNITO_POOL_ID,
    tokenUse: 'access' // Possible Values: access | id
  });

  const accessTokenFromClient = req.get('access_token') || req.get('accesstoken');
  cognitoExpress.validate(accessTokenFromClient, async (err, response) => {
    if (err) return next(new UnauthorizedError({ message: err.message }));
    res.locals.auth = response;
    return next();
  });
};

module.exports = {
  preRequest
};
