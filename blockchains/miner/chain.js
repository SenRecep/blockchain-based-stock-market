import { Block } from "./block.js";
import { BlockHeader } from "./block.js";
import moment from "moment";
import { Level } from "level";
import { readdirSync, existsSync, mkdirSync } from "fs";
import { __dirname } from "./path.js";
import CryptoJS from "crypto-js";
const { SHA256 } = CryptoJS;
import logger from "./logger.js";
let db;

export const getGenesisBlock = () => {
  let blockHeader = new BlockHeader(
    1,
    null,
    "0x1bc1100000000000000000000000000000000000000000000",
    moment().unix(),
    "0x171b7320",
    "1CAD2B8C"
  );
  return new Block(blockHeader, 0, []);
};

export const blockchain = [getGenesisBlock()];

export const getExistId = () => {
  const files = readdirSync("./db");
  for (const file of files) {
    const isFile = file.split(".").length > 1;
    if (!isFile) return file;
  }
  return null;
};

export const createDb = (peerId) => {
  let dir = __dirname + "/db/" + peerId;
  if (!existsSync(dir)) {
    mkdirSync(dir);
    db = new Level(dir);
    storeBlock(getGenesisBlock());
  }
};

export const openDb = (peerId) => {
  let dir = __dirname + "/db/" + peerId;
  db = new Level(dir);

  (async () => {
    const keys = (await db.keys().all())
      .map((key) => +key)
      .sort((a, b) => a - b);
    const records = (await db.getMany(keys)).map((record) =>
      JSON.parse(record)
    );
    blockchain.splice(0, 1);
    blockchain.push(...records);
  })();
};

export const getLatestBlock = () => blockchain[blockchain.length - 1];

export const addBlock = (newBlock) => {
  let prevBlock = getLatestBlock();
  if (
    prevBlock.index < newBlock.index &&
    newBlock.blockHeader.previousBlockHeader ===
      prevBlock.blockHeader.merkleRoot
  ) {
    blockchain.push(newBlock);
    storeBlock(newBlock); // When you generate a new block using the generateNextBlock method, you can now store the block in the LevelDB database
  }
};

// create a storeBlock method to store the new block
export const storeBlock = (newBlock) => {
  db.put(newBlock.index, JSON.stringify(newBlock), function (err) {
    if (err) return logger.info("Ooops!", err); // some kind of I/O error
    logger.info("--- Inserting block index: " + newBlock.index);
  });
};

export const getDbBlock = (index, res) => {
  db.get(index, function (err, value) {
    if (err) return res.send(JSON.stringify(err));
    return res.json(value);
  });
};

export const getBlock = (index) => {
  if (blockchain.length - 1 >= index) return blockchain[index];
  else return null;
};

export const generateNextBlock = (txns) => {
  const prevBlock = getLatestBlock();
  const prevMerkleRoot = prevBlock.blockHeader.merkleRoot;
  const nextIndex = prevBlock.index + 1;
  const nextTime = moment().unix();
  const nextMerkleRoot = SHA256(1, prevMerkleRoot, nextTime).toString();

  const blockHeader = new BlockHeader(
    1,
    prevMerkleRoot,
    nextMerkleRoot,
    nextTime
  );
  const newBlock = new Block(blockHeader, nextIndex, txns);
  blockchain.push(newBlock);
  storeBlock(newBlock);
  return newBlock;
};

export const getTransactionsByPublicKey = (publicKey) => {
  const response = [];
  for (let i = blockchain.length - 1; i >= 0; i--) {
    const element = blockchain[i];
    if (Array.isArray(element.txns))
      for (let j = element.txns.length - 1; j >= 0; j--) {
        const transaction = element.txns[j];
        if (transaction.from == publicKey || transaction.to == publicKey)
          response.push(transaction);
      }
  }
  return response;
};
