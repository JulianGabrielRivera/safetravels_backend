const express = require("express");
const router = express.Router();
const axios = require("axios");

const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);
// const endpointSecret = "whsec_Xw9HK00uvxCL595WC5Y8YZKskY9ckuAS";
const endpointSecret = "whsec_VQcNyuCrPVaVeETFm222D0ydbcSU25Mj";

const fulfillOrder = (lineItems) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems);
};
router.post("/stripe", async (req, res) => {
  try {
    const product = await stripe.products.retrieve("prod_P28zCO9jHcC8no");
    const session = await stripe.checkout.sessions.create({
      success_url: "https://example.com/success",
      line_items: [{ price: "price_1OE4hFFNeaqqGqZ9ogLoxS7S", quantity: 1 }],
      mode: "payment",
    });

    console.log(session);
    res.json(session);
  } catch (err) {
    console.log(err);
  }
});

router.post("/webhook", async (request, response) => {
  const payload = request.body;
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
      {
        expand: ["line_items"],
      }
    );
    const lineItems = sessionWithLineItems.line_items;

    // Fulfill the purchase...
    fulfillOrder(lineItems);
  }

  response.status(200).end();
});

// router.post("/webhook", async (req, res) => {
//   const payload = req.body;
//   console.log(payload);

//   const sig = request.headers["stripe-signature"];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//     if (event.type === "checkout.session.completed") {
//       console.log("hey");
//       // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
//       const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
//         event.data.object.id,
//         {
//           expand: ["line_items"],
//         }
//       );

//       res.status(200).end();
//     }
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// });

module.exports = router;
