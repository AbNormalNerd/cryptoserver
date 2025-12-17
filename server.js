const express = require("express");
const axios = require("axios");

const app = express();

// ADD OR REMOVE COINS HERE
const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "dogecoin",
  "cardano",
  "avalanche-2",
  "shiba-inu",
  "pepe"
];

app.get("/prices", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: COINS.join(","),
          vs_currencies: "usd",
          include_24hr_change: true
        }
      }
    );

    res.json(response.data);
  } catch {
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(3000);
