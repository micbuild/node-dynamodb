class Model {
  constructor(args) {
    Object.assign(this, args);
  }

  async get(args){
    const { offset, limit } = args;
    const orders = await this.connectors.db.getOrders({
      ...args
    });

    const ordersWithStripeData = await Promise.all(orders.map(async order => {
      const stripeUser = await this.connectors.stripe.getCustomerByEmail(order.email);

      return {
        ...order,
        name: stripeUser.name,
        shippingAddress: {
          line1: stripeUser.shipping.address.line1,
          line2: stripeUser.shipping.address.line2,
          city: stripeUser.shipping.address.city,
          state: stripeUser.shipping.address.state,
          postalCode: stripeUser.shipping.address.postal_code,
          country: stripeUser.shipping.address.country
        }
      }
    }));

    const total = await this.connectors.db.countOrder({ });

    return {
      data: orders,
      total, limit, offset
    };
  }
}

module.exports = Model;
