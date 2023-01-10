import express, { json } from "express";
import { Transaction } from "./Transaction.js";
import wallets from "./wallets.js";
const app = express();
const PORT = 8080;
app.use(json());
const tx = new Transaction({
  from: wallets["wallet-one"].publicKey,
  to: wallets["wallet-two"].publicKey,
  data: {
    fromProduct: "1",
    toProductId: "2",
  },
});
console.log(tx);
tx.sign(wallets["wallet-one"].privateKey);
console.log(JSON.stringify(tx));
const isValid = tx.isValid();
console.log(isValid);

app.get("/", (req, res) => {
  res.json({
    name: "Recep",
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
