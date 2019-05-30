const {
  connectors: { BaseMongoConnector }
} = require('@leif.nambara/mongo-connector');

class CbcDbConnector extends BaseMongoConnector {
  constructor(args) {
    super(args);
  }

  async listCbc({ userId }){
    const result = await this.collection.find({ userId }, { sort: [['createdAt', 'descending']] }).toArray();
    const array = result.map(this._mapResult);
    return array;
  }
}

module.exports = CbcDbConnector;
