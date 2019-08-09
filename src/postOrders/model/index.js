class Model {
  constructor(args) {
    Object.assign(this, args);
  }

  async create(args){
    const {
      productId,
      type
    } = args;

    let product;
    if (type === 'subscription') {
      product = await this.connectors.stripe.getProduct({ productId });
    }

    const id = await this.connectors.db.insert({
      productName: product ? product.name : undefined,
      ...args
    });

    return id;
  }
}

module.exports = Model;
