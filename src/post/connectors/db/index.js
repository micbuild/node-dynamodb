const uuidv4 = require('uuid/v4');

class InflightDbConnector {
  /**
   * @param {object} args
   * @param {object} args.logger
   * @param {object} args.config
   * @param {object} args.db
   */
  constructor(args) {
    Object.assign(this, args);
    this.tablename = 'inflights';
  }

  async insert({
    customerId, inflightTypeCode, productId, peerProductId, numberOfUnits = 0, grossTransactionAmount = 0
  }) {
    const id = uuidv4();
    const query = `insert into ${this.tablename} (` +
        `id, ` +
        `customer_id, ` +
        `inflight_tp_cd, ` +
        `product_id, ` +
        `peer_product_id, ` +
        `number_of_units, ` +
        `gross_transaction_amount ` +
      `) values (` +
        `'${id}', ` +
        `'${customerId}', ` +
        `${inflightTypeCode}, ` +
        `'${productId}', ` +
        (peerProductId ? `'${peerProductId}', ` : 'NULL, ') +
        `${numberOfUnits}, ` +
        `${grossTransactionAmount} ` +
      `)`;

    await this.db.query(query);
    return id;
  }
}

module.exports = InflightDbConnector;
