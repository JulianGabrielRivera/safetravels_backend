const express = require("express");
const router = express.Router();
const axios = require("axios");

const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);
const endpointSecret = "whsec_Xw9HK00uvxCL595WC5Y8YZKskY9ckuAS";

router.post("/stripe", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://example.com/success",

      line_items: [{ price: "price_1OBA5TFNeaqqGqZ9ztemS7yl", quantity: 1 }],
      mode: "subscription",
      //   invoice_creation: true,
    });

    const payload = req.body;
    console.log(payload);
    // const session2 = await stripe.checkout.sessions.retrieve(`${session.id}`);
    // console.log(session2, "sesh");
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 0.01,
    //   currency: "usd",
    //   payment_method_types: ["card"],
    //   description: "Thanks for your purchase!",
    //   receipt_email: "juliangabrielriveradev@gmail.com",
    // });
    // console.log(paymentIntent);
    // const invoice = await stripe.invoices.sendInvoice(`${session.id}`);
    // console.log(invoice);
    console.log(session);
    res.json(session.url);
  } catch (err) {
    console.log(err);
  }
});

router.post("/webhook", async (req, res) => {
  const payload = req.body;
  console.log(payload);

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    if (event.type === "checkout.session.completed") {
      console.log("hey");
      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        event.data.object.id,
        {
          expand: ["line_items"],
        }
      );

      res.status(200).end();
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

module.exports = router;
