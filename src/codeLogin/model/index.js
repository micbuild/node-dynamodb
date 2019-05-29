class Model {
  /**
   * @param {object} args
   * @param {object} args.logger
   * @param {object} args.config
   */
  constructor(args) {
    Object.assign(this, args);
  }

  async getToken(args) {
    const tokens = await this.connectors.auth.getToken(args);
    return tokens;
  };
}

module.exports = Model;
