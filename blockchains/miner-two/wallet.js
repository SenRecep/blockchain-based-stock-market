import elliptic from "elliptic";
const { ec: EC } = elliptic;
import { existsSync, readFileSync, writeFileSync } from "fs";
import { __dirname } from "./path.js";
import logger from "./logger.js";

const ec = new EC("secp256k1"); // create and initialize the EC context

const privateKeyLocation = __dirname + "/wallet/private_key"; // store the location of your wallet’s private key

// create a method exports.initWallet to generate the actual public-private key, generatePrivateKey
export function initWallet() {
  let privateKey;

  // you will be generating a new wallet only if one doesn’t exist
  if (existsSync(privateKeyLocation)) {
    const buffer = readFileSync(privateKeyLocation, "utf8");
    privateKey = buffer.toString();
  } else {
    privateKey = generatePrivateKey();
    writeFileSync(privateKeyLocation, privateKey);
  }

  const key = ec.keyFromPrivate(privateKey, "hex");
  const publicKey = key.getPublic().encode("hex");
  return { privateKeyLocation: privateKeyLocation, publicKey: publicKey };
}

const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

// To see the code working, script will create the public and private keys
let retVal = initWallet();
logger.info(JSON.stringify(retVal));
