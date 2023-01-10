import elliptic from "elliptic";
const { ec: EC } = elliptic;
import CryptoJS from "crypto-js";
const { SHA256 } = CryptoJS;
const ec = new EC("secp256k1"); // create and initialize the EC context
import BN from "bn.js";
import logger from "./logger.js";

export class BlockHeader {
  constructor(version, previousBlockHeader, merkleRoot, time, nBits, nounce) {
    // Version - at the time of writing there are 4 block versions.
    this.version = version;

    // previous block header hash - A SHA256(SHA256()) hash of previous block’s header. Ensures that previous block cannot be changed as this block needs to be changed as well.
    this.previousBlockHeader = previousBlockHeader;

    // merkle root hash - a merkle tree is a binary tree which holds all the hashed pairs of the tree.
    this.merkleRoot = merkleRoot;

    // a Unix epoch time when the miner started hashing the header.
    this.time = time;
  }
}

export class Block {
  constructor(blockHeader, index, txns) {
    this.blockHeader = blockHeader;

    // GenesisBlock is the first block - block 0
    this.index = index;

    // txns is the raw transaction in the block.
    this.txns = txns;
  }
}

export class Transaction {
  constructor({ from, to, data, signature }) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.signature = signature;
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
      logger.error("sign error", error);
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
      logger.error("getPubKey error", error);
    }
  }

  isValid() {
    try {
      if (!this.from)
        throw new Error("Transaction has does have from property");
      if (!this.to) throw new Error("Transaction has does have to property");
      if (!this.data)
        throw new Error("Transaction has does have datas property");
      const { from, data, signature } = this;

      if (!signature.r && !signature.v && !signature.s) {
        logger.error(`Transaction rejected: Unsigned transaction`);
        return false;
      }

      // Check that the data field is valid
      if (!this.isValidData(data)) {
        logger.error(
          `Transaction rejected: Invalid data: ${JSON.stringify(data)}`
        );
        return false;
      }

      const txSenderPubkey = this.getPubKey();

      // Check that the fromAddress corresponds to the address used to sign the transaction
      const txSenderAddress = SHA256(txSenderPubkey);
      const fromAddress = SHA256(from);

      if (txSenderAddress.toString() !== fromAddress.toString()) {
        logger.error(
          `Transaction rejected: Invalid fromAddress. Expected ${txSenderAddress}, got ${fromAddress}`
        );
        return false;
      }

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
  isValidData(data) {
    if (this.isObject(data)) return true;
  }

  isObject(item) {
    return (
      item && typeof item === "object" && !Array.isArray(item) && item !== null
    );
  }
}
