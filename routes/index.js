var express = require("express");
var router = express.Router();
const accountSid = process.env.TWILIO_ACC_SID;

const authToken = process.env.TWILIO_ACC_TOKEN;

const client = require("twilio")(accountSid, authToken);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);
const nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/send-message", async (req, res) => {
  try {
    const message = await client.messages.create({
      body: "Hello from Node",
      to: "+13212638191",
      from: "+18556242805",
    });
    console.log(message);
  } catch (err) {
    console.log(err);
  }
});

router.post("/email-promo", (req, res) => {
  const msg = {
    to: "juliangabrielriveradev@gmail.com", // Change to your recipient
    from: "juliangabrielriveradev@gmail.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(msg);
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;
