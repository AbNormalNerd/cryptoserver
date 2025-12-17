const express = require("express");
const axios = require("axios");

const app = express();

// ADD OR REMOVE COINS HERE
const COINS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "usd-coin",
  "xrp",
  "staked-ether",
  "cardano",
  "dogecoin",
  "avalanche-2",
  "shiba-inu",
  "tron",
  "polkadot",
  "chainlink",
  "polygon",
  "litecoin",
  "bitcoin-cash",
  "near",
  "uniswap",
  "ethereum-classic",
  "stellar",
  "cosmos",
  "algorand",
  "monero",
  "vechain",
  "filecoin",
  "internet-computer",
  "theta-token",
  "fantom",
  "hedera-hashgraph",
  "eos",
  "apecoin",
  "elrond-erd-2",
  "the-sandbox",
  "axie-infinity",
  "decentraland",
  "chiliz",
  "enjincoin",
  "flow",
  "gala",
  "the-graph",
  "curve-dao-token",
  "maker",
  "compound-governance-token",
  "aave",
  "synthetix-network-token",
  "yearn-finance",
  "1inch",
  "0x",
  "basic-attention-token",
  "zcash",
  "dash",
  "tezos",
  "neo",
  "waves",
  "qtum",
  "icon",
  "zilliqa",
  "ontology",
  "nano",
  "siacoin",
  "digibyte",
  "verge"
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
