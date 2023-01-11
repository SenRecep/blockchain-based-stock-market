import elliptic from "elliptic";
const { ec: EC } = elliptic;
import CryptoJS from "crypto-js";
const { SHA256 } = CryptoJS;
const ec = new EC("secp256k1"); // create and initialize the EC context
import BN from "bn.js";

export class Transaction {
  #valid() {
    if (!this.from) throw new Error("Transaction has does have from property");
    if (!this.to) throw new Error("Transaction has does have to property");
    if (!this.data) throw new Error("Transaction has does have datas property");
  }
  constructor({ from, to, data }) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.#valid();
  }
  getHash() {
    return SHA256(this.from + this.to + JSON.stringify(this.data)).toString();
  }
  sign(privateKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const sigObj = keyPair.sign(this.getHash());
      this.signature = {
        v: sigObj.recoveryParam.toString(16),
        r: sigObj.r.toString(16),
        s: sigObj.s.toString(16),
      };
    } catch (error) {
      console.error("sign error", error);
    }
  }

  getPubKey() {
    try {
      const msgHash = this.getHash();
      const { r, s, v } = this.signature;
      const sigObj = {
        r: new BN(r, 16),
        s: new BN(s, 16),
        recoveryParam: parseInt(v, 16),
      };

      // Recover public key and get real address.
      const txSenderPubkey = ec.recoverPubKey(
        new BN(msgHash, 16).toString(10),
        sigObj,
        ec.getKeyRecoveryParam(msgHash, sigObj, ec.genKeyPair().getPublic())
      );

      return ec.keyFromPublic(txSenderPubkey).getPublic("hex");
    } catch (error) {
      console.error("getPubKey error", error);
    }
  }

  isValid() {
    try {
      const { from, data, signature } = this;

      if (!signature.r && !signature.v && !signature.s) {
        console.error(`Transaction rejected: Unsigned transaction`);
        return false;
      }

      const txSenderPubkey = this.getPubKey();

      // Check that the fromAddress corresponds to the address used to sign the transaction
      const txSenderAddress = SHA256(txSenderPubkey);
      const fromAddress = SHA256(from);

      if (txSenderAddress.toString() !== fromAddress.toString()) {
        console.log(
          `Transaction rejected: Invalid fromAddress. Expected ${txSenderAddress}, got ${fromAddress}`
        );
        return false;
      }

      // Check that the data field is valid
      if (!this.isValidData(data)) {
        console.error(
          `Transaction rejected: Invalid data: ${JSON.stringify(data)}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  isValidData(data) {
    if (this.isObject(data)) return true;
  }

  isObject(item) {
    return typeof item === "object" && !Array.isArray(item) && item !== null;
  }
}
