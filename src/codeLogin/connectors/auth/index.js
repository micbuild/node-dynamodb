class Auth {
  constructor(args) {
    Object.assign(this, args);
    this.idmRequest = this.request.defaults({
      baseUrl: this.config.baseUrl,
      json: true,
      timeout: 30000
    });
  }

  async getToken({ code }) {
    console.log(this.config);
    const response =  await this.idmRequest({
      url: '/token',
      method: 'POST',
      auth:{
        user: this.config.clientId,
        pass: this.config.clientSecret
      },
      form: {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        scope: 'openid',
        redirect_uri: this.config.redirectUri,
        code
      }
    });

    return response;
  }
}

module.exports = Auth;
