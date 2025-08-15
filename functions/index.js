const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 👇 variables d'env lues dans functions/.env
const FROM_EMAIL = process.env.GMAIL_EMAIL;
const FROM_PASS  = process.env.GMAIL_PASSWORD;

if (!FROM_EMAIL || !FROM_PASS) {
  console.warn("⚠️ GMAIL_EMAIL / GMAIL_PASSWORD manquants. Ajoute-les dans functions/.env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: FROM_EMAIL, pass: FROM_PASS },
});

app.post("/", async (req, res) => {
  try {
    const { name, email, _subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("Champs manquants");
    }
    await transporter.sendMail({
      from: `"Portfolio" <${FROM_EMAIL}>`,
      replyTo: email,
      to: FROM_EMAIL,
      subject: _subject || "Nouveau message de contact",
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
    });
    return res.redirect(303, "/#contact-sent");
  } catch (e) {
    console.error(e);
    return res.status(500).send("Erreur d'envoi");
  }
});

exports.sendContactEmail = functions.https.onRequest(app);
