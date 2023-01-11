import { ports } from "../../../store/blockchain-ports.store.js";
import axios from "axios";

class BlockchainService {
  async sendTransaction(transaction) {
    const port = ports[0];
    await axios.post(`http://localhost:${port}/transactions`, transaction, {
      "Content-Type": "application/json",
    });
  }
}

const instance = new BlockchainService();

export default instance;

export { BlockchainService };
