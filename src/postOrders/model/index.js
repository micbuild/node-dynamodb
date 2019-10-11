class Model {
  constructor(args) {
    Object.assign(this, args);
  }

  async create(args){
    const {
      productId,
      type
    } = args;

    let id;
    if (type === 'subscription') {
      const product = await this.connectors.stripe.getProduct({ productId });
      id = await this.connectors.db.insert({
        productName: product ? product.name : undefined,
        ...args
      });
    }

    if (type === 'onetime') {
      const customer = await this.connectors.stripe.getCustomer({ customerId: args.customer });
      id = await this.connectors.db.insert({
        shippingAddress: customer.shipping.address,
        email: customer.email,
        productId: args.productName,
        ...args
      });
    }

    return id;
  }
}

module.exports = Model;
