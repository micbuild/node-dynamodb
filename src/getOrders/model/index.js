class Model {
  constructor(args) {
    Object.assign(this, args);
  }

  async get(args){
    const { offset, limit, email } = args;
    const orders = await this.connectors.db.getOrders({
      ...args
    });

    const total = await this.connectors.db.countOrder({
      email
    });

    return {
      data: orders,
      total, limit, offset
    };
  }
}

module.exports = Model;
