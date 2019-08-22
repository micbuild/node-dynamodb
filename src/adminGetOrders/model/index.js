class Model {
  constructor(args) {
    Object.assign(this, args);
  }

  async get(args){
    const { offset, limit } = args;
    const orders = await this.connectors.db.getOrders({
      ...args
    });

    const total = await this.connectors.db.countOrder({ });

    return {
      data: orders,
      total, limit, offset
    };
  }
}

module.exports = Model;
