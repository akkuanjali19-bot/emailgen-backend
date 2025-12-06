// index.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); 
const app = express();

app.use(cors());
app.use(express.json());

function makeRandomString(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}
const DOMAINS = ["1secmail.com", "1secmail.org", "1secmail.net"];

app.get("/api/new-email", (req, res) => {
  const name = makeRandomString(8);
  const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
  const email = `${name}@${domain}`;

  res.json({
    email,
    password: "NoPasswordNeeded"
  });
});

app.get("/api/inbox", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: "Missing email query" });

  const [login, domain] = email.split("@");

  try {
    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal error", detail: String(err) });
  }
});

app.get("/api/email", async (req, res) => {
  const email = req.query.email;
  const id = req.query.id;
  if (!email || !id) return res.status(400).json({ error: "Missing email or id" });

  const [login, domain] = email.split("@");

  try {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${id}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal error", detail: String(err) });
  }
});

app.get("/", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
