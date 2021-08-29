import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_KEY);
export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(req, res) {
  if (req.method === 'POST') {
    let event;
    try {
      const rawBody = await buffer(req);
      const signature = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(
        rawBody.toString(),
        signature,
        process.env.STRIPE_WEBHOOK_KEY
      );
    } catch (err) {
      res.status(400).send(`Webhook error ${err.message}`);
    }

    console.log('Success ', event.id);
    if (event.type === 'checkout.payment.completed') {
      console.log('Payment received');
    }
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}