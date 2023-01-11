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
    fromUserId: "63be4295418cc1cc425480ba",
    toUserId: "63be4235418cc1cc4254808d",
    fromProductId: "63be42b4418cc1cc425480c7",
    toProductId: "63be4259418cc1cc42548099",
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
