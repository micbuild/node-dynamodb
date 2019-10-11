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

      const dbResult = await this.collection.find(query, {
        limit, skip: offset,
        sort: [['createdAt', 'desc']]
      }).toArray();
      result = dbResult.map(item => ({
        ...item,
        orderId: item._id
      }));
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
