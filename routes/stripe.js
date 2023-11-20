const express = require("express");
const router = express.Router();
const axios = require("axios");

const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);
// const endpointSecret = "whsec_Xw9HK00uvxCL595WC5Y8YZKskY9ckuAS";
const endpointSecret =
  "whsec_d0ab13239b6a6016274511a33e9081d65072bfc9421eca63ee4b6f6e2995f05b";

router.post("/stripe", async (req, res) => {
  try {
    const product = await stripe.products.retrieve("prod_P28zCO9jHcC8no");
    const session = await stripe.checkout.sessions.create({
      success_url: "https://safetravels-frontend.vercel.app/checkout-success",
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
  const sig = request.headers["stripe-signature"];
  console.log("shot");
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log(event, "EVENT");
    console.log(request.body);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded = event.data.object;
      console.log(event, "event");
      console.log(request.body);
      console.log("fired");
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
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
