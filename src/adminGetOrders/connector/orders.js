const {
  connectors: { BaseMongoConnector }
} = require('@leif.nambara/mongo-connector');

class OrderConnector extends BaseMongoConnector {
  constructor(args) {
    super(args);
  }

  async getOrders({
    limit,
    offset,
    before,
    after,
    ...query
  }) {
    let result;
    try {
      if (before || after) {
        query.createdAt = {};
      }

      if(before) {
        query.createdAt.$lte = before;
      }

      if(after) {
        query.createdAt.$gte = after;
      }

      result = await this.collection.find(query, { limit, skip: offset }).toArray();
    } catch (e) {
      this._errorHandler(e);
    }

    return result;
  }

  async countOrder({

  }) {
    const count = await this.collection.countDocuments({ });
    return count
  }
}

module.exports = OrderConnector;
