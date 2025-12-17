const express = require("express");
const axios = require("axios");

const app = express();

// All coins from CryptoData.lua (64 coins total)
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

// Coin metadata mapping (for symbol and name)
const COIN_METADATA = {
  "bitcoin": { symbol: "BTC", name: "Bitcoin" },
  "ethereum": { symbol: "ETH", name: "Ethereum" },
  "tether": { symbol: "USDT", name: "Tether" },
  "binancecoin": { symbol: "BNB", name: "BNB" },
  "solana": { symbol: "SOL", name: "Solana" },
  "usd-coin": { symbol: "USDC", name: "USD Coin" },
  "xrp": { symbol: "XRP", name: "XRP" },
  "staked-ether": { symbol: "ETH2", name: "Staked Ether" },
  "cardano": { symbol: "ADA", name: "Cardano" },
  "dogecoin": { symbol: "DOGE", name: "Dogecoin" },
  "avalanche-2": { symbol: "AVAX", name: "Avalanche" },
  "shiba-inu": { symbol: "SHIB", name: "Shiba Inu" },
  "tron": { symbol: "TRX", name: "TRON" },
  "polkadot": { symbol: "DOT", name: "Polkadot" },
  "chainlink": { symbol: "LINK", name: "Chainlink" },
  "polygon": { symbol: "MATIC", name: "Polygon" },
  "litecoin": { symbol: "LTC", name: "Litecoin" },
  "bitcoin-cash": { symbol: "BCH", name: "Bitcoin Cash" },
  "near": { symbol: "NEAR", name: "NEAR Protocol" },
  "uniswap": { symbol: "UNI", name: "Uniswap" },
  "ethereum-classic": { symbol: "ETC", name: "Ethereum Classic" },
  "stellar": { symbol: "XLM", name: "Stellar" },
  "cosmos": { symbol: "ATOM", name: "Cosmos" },
  "algorand": { symbol: "ALGO", name: "Algorand" },
  "monero": { symbol: "XMR", name: "Monero" },
  "vechain": { symbol: "VET", name: "VeChain" },
  "filecoin": { symbol: "FIL", name: "Filecoin" },
  "internet-computer": { symbol: "ICP", name: "Internet Computer" },
  "theta-token": { symbol: "THETA", name: "Theta Network" },
  "fantom": { symbol: "FTM", name: "Fantom" },
  "hedera-hashgraph": { symbol: "HBAR", name: "Hedera" },
  "eos": { symbol: "EOS", name: "EOS" },
  "apecoin": { symbol: "APE", name: "ApeCoin" },
  "elrond-erd-2": { symbol: "EGLD", name: "MultiversX" },
  "the-sandbox": { symbol: "SAND", name: "The Sandbox" },
  "axie-infinity": { symbol: "AXS", name: "Axie Infinity" },
  "decentraland": { symbol: "MANA", name: "Decentraland" },
  "chiliz": { symbol: "CHZ", name: "Chiliz" },
  "enjincoin": { symbol: "ENJ", name: "Enjin Coin" },
  "flow": { symbol: "FLOW", name: "Flow" },
  "gala": { symbol: "GALA", name: "Gala" },
  "the-graph": { symbol: "GRT", name: "The Graph" },
  "curve-dao-token": { symbol: "CRV", name: "Curve DAO Token" },
  "maker": { symbol: "MKR", name: "Maker" },
  "compound-governance-token": { symbol: "COMP", name: "Compound" },
  "aave": { symbol: "AAVE", name: "Aave" },
  "synthetix-network-token": { symbol: "SNX", name: "Synthetix" },
  "yearn-finance": { symbol: "YFI", name: "yearn.finance" },
  "1inch": { symbol: "1INCH", name: "1inch Network" },
  "0x": { symbol: "ZRX", name: "0x Protocol" },
  "basic-attention-token": { symbol: "BAT", name: "Basic Attention Token" },
  "zcash": { symbol: "ZEC", name: "Zcash" },
  "dash": { symbol: "DASH", name: "Dash" },
  "tezos": { symbol: "XTZ", name: "Tezos" },
  "neo": { symbol: "NEO", name: "Neo" },
  "waves": { symbol: "WAVES", name: "Waves" },
  "qtum": { symbol: "QTUM", name: "Qtum" },
  "icon": { symbol: "ICX", name: "ICON" },
  "zilliqa": { symbol: "ZIL", name: "Zilliqa" },
  "ontology": { symbol: "ONT", name: "Ontology" },
  "nano": { symbol: "NANO", name: "Nano" },
  "siacoin": { symbol: "SC", name: "Siacoin" },
  "digibyte": { symbol: "DGB", name: "DigiByte" },
  "verge": { symbol: "XVG", name: "Verge" }
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", coins: COINS.length, timestamp: new Date().toISOString() });
});

app.get("/prices", async (req, res) => {
  try {
    // Set timeout for CoinGecko API request
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: COINS.join(","),
          vs_currencies: "usd",
          include_24hr_change: true,
          include_market_cap: true
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Validate response
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn("Empty response from CoinGecko");
      return res.status(503).json({ error: "No price data available" });
    }

    // Transform response to match Roblox game's expected format
    const transformedData = {};
    
    for (const [coinId, data] of Object.entries(response.data)) {
      const metadata = COIN_METADATA[coinId] || { symbol: coinId.toUpperCase(), name: coinId };
      
      transformedData[coinId] = {
        price: data.usd || 0,
        change_24h: data.usd_24h_change || 0,
        change24h: data.usd_24h_change || 0,
        "24h_change": data.usd_24h_change || 0,
        market_cap: data.usd_market_cap || 0,
        marketCap: data.usd_market_cap || 0,
        symbol: metadata.symbol,
        name: metadata.name
      };
    }

    // Add CORS headers for Roblox
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    
    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching prices:", error.message);
    
    // Return appropriate status code
    if (error.response) {
      // CoinGecko API error
      console.error("CoinGecko API error:", error.response.status, error.response.data);
      res.status(502).json({ error: "CoinGecko API error", status: error.response.status });
    } else if (error.request) {
      // Request made but no response
      console.error("No response from CoinGecko");
      res.status(504).json({ error: "Request timeout" });
    } else {
      // Other error
      res.status(500).json({ error: "Failed to fetch prices", message: error.message });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit, let the process continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Crypto price proxy server running on port ${PORT}`);
  console.log(`📊 Supporting ${COINS.length} cryptocurrencies`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`💰 Prices endpoint: http://localhost:${PORT}/prices`);
});

