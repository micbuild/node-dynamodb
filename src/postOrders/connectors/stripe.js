class StripeConnector {
  constructor(args) {
    Object.assign(this, args);
  }

  async searchCustomer({
    email,
    limit
  }) {
    const respose = await this.stripe.customers.list({
      limit,
      email
    });

    return respose.data;
  }

  async getCustomer({
    customerId
  }) {
    const response = await this.stripe.customers.retrieve(customerId);
    return response;
  }

  async getProduct({
    productId
  }) {
    const response = await this.stripe.products.retrieve(productId);
    return response;
  }

  async createCustomer({
    name,
    email,
    phone,
    shippingAddress,
    gender,
    dateOfBirth
  }) {
    const {
      line1,
      line2,
      city,
      state,
      postalCode,
      country
    } = shippingAddress;

    const customer = await this.stripe.customers.create({
      name,
      email,
      phone,
      shipping: {
        address: {
          line1,
          line2,
          city,
          state,
          postal_code: postalCode,
          country
        },
        name,
        phone
      },
      metadata: {
        Gender: gender,
        'Date Of Birth': dateOfBirth
      }
    });

    return customer;
  }

  async createCheckoutSession({
    customerId,
    plan,
    successUrl,
    cancelUrl
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      subscription_data: { items: [{ plan }] },
      success_url: successUrl, //'https://example.com/success',
      cancel_url: cancelUrl, //'https://example.com/cancel',
      customer: customerId
    });

    return session;
  }
}

module.exports = StripeConnector;
