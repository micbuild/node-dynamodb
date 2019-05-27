class Model {
  /**
   * @param {object} args
   * @param {object} args.logger
   * @param {object} args.config
   */
  constructor(args) {
    Object.assign(this, args);
  }

  async create(args) {
    const id = await this.connectors.db.insert(args);
    return id;
  };
}

module.exports = Model;
