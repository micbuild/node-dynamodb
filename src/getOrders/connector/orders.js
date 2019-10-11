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
    email
  }) {
    let result;
    try {
      const query = { email };
      if (before || after) {
        query.createdAt = {};
      }

      if(before) {
        query.createdAt.$lte = before;
      }

      if(after) {
        query.createdAt.$gte = after;
      }

      result = await this.collection.find(query, {
        limit, skip: offset,
        sort: [['createdAt', 'desc']]
      }).toArray();
    } catch (e) {
      this._errorHandler(e);
    }

    return result;
  }

  async countOrder({
    email
  }) {
    const count = await this.collection.countDocuments({ email });
    return count
  }
}

module.exports = OrderConnector;
