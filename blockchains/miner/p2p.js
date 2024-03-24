import { randomBytes } from "crypto";
import Swarm from "discovery-swarm";
import defaults from "dat-swarm-defaults";
import getPort from "get-port";
import {
  getExistId,
  createDb,
  openDb,
  blockchain,
  getDbBlock,
  getBlock,
  addBlock,
  getLatestBlock,
  generateNextBlock,
  getTransactionsByPublicKey,
} from "./chain.js";
import { CronJob } from "cron";
import express, { json } from "express";
import { initWallet } from "./wallet.js";
import { Transaction } from "./block.js";
import logger from "./logger.js";
import axios from "axios";
import { API_PORT } from "./config.js";

// Set your variables to hold an object with the peers and connection sequence
const peers = {};
let connSeq = 0;

let channel = "myBlockchain";
let registeredMiners = [];
let transactions = [];
let lastBlockMinedBy = null;
let PORT = 5510;

// define a message type to request and receive the latest block
let MessageType = {
  REQUEST_BLOCK: "requestBlock",
  RECEIVE_NEXT_BLOCK: "receiveNextBlock",
  RECEIVE_NEW_BLOCK: "receiveNewBlock",
  REQUEST_ALL_REGISTER_MINERS: "requestAllRegisterMiners",
  REGISTER_MINER: "registerMiner",
};

const existId = getExistId();
const myPeerId = existId ?? randomBytes(32);
logger.info("myPeerId: " + myPeerId.toString("hex"));

// create a database once you start the code
if (!existId) createDb(myPeerId.toString("hex"));
else openDb(existId);

// create a method called initHttpServer that will initiate the server and create the services
let initHttpServer = (port) => {
  let http_port = "80" + port.toString().slice(-2);
  PORT = http_port;
  axios.post(`${API_PORT}/blockchain/${PORT}`);
  let app = express();
  app.use(json());

  //  Blocks service will be retrieving all of your blocks
  app.get("/blocks", (req, res) => res.json(blockchain));

  // getBlock service will be retrieving one block based on an index
  app.get("/getBlock", (req, res) => {
    let blockIndex = req.query.index;
    res.json(blockchain[blockIndex]);
  });

  //  getDBBlock service will be retrieving a LevelDB database entry based on an index
  app.get("/getDBBlock", (req, res) => {
    let blockIndex = req.query.index;
    getDbBlock(blockIndex, res);
  });

  //getWallet service will be utilizing the wallet.js file you created in the previous step and generate your public-private key pair
  app.get("/getWallet", (req, res) => {
    res.json(initWallet());
  });

  app.get("/transactions/:publicKey", (req, res) => {
    const publicKey = req.params.publicKey;
    var response = getTransactionsByPublicKey(publicKey);
    res.json(response);
  });

  app.post("/transactions", (req, res) => {
    const transaction = new Transaction(req.body);
    try {
      const isValid = transaction.isValid();
      if (!isValid) throw new Error("Transaction is not valid");
      transactions.push(transaction);
      res.json({
        message: "Transaction added",
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({
        message: error.message,
      });
    }
  });

  app.listen(http_port, () =>
    logger.info("Listening http on port: " + http_port)
  );
};

// generate a config object that holds your peer ID
const config = defaults({
  id: myPeerId,
});

// initialize swarm library using config as object
const swarm = Swarm(config);

(async () => {
  // listen on the random port selected
  const port = await getPort();

  initHttpServer(port); // call the initHttpServer

  swarm.listen(port);
  logger.info("Listening port: " + port);

  swarm.join(channel);
  swarm.on("connection", (conn, info) => {
    const seq = connSeq;
    const peerId = info.id.toString("hex");
    logger.info(`Connected #${seq} to peer: ${peerId}`);
    if (info.initiator) {
      try {
        // use setKeepAlive to ensure the network connection stays with other peers
        conn.setKeepAlive(true, 600);
      } catch (exception) {
        logger.info("exception", exception);
      }
    }

    // Once you receive a data message on the P2P network, you parse the data using JSON.parse
    conn.on("data", (data) => {
      let message = JSON.parse(data);
      logger.info("----------- Received Message start -------------");
      logger.info(
        "from: " + peerId.toString("hex"),
        "to: " + peerId.toString(message.to),
        "my: " + myPeerId.toString("hex"),
        "type: " + JSON.stringify(message.type)
      );
      logger.info("----------- Received Message end -------------");

      /* 
              once a connection data event message is received, you can create your switch 
              code to handle the different types of requests
            */
      switch (message.type) {
        case MessageType.REQUEST_BLOCK:
          logger.info("-----------REQUEST_BLOCK-------------");
          let requestedIndex = JSON.parse(JSON.stringify(message.data)).index;
          let requestedBlock = getBlock(requestedIndex);
          if (requestedBlock)
            writeMessageToPeerToId(
              peerId.toString("hex"),
              MessageType.RECEIVE_NEXT_BLOCK,
              requestedBlock
            );
          else logger.info("No block found @ index: " + requestedIndex);
          logger.info("-----------REQUEST_BLOCK-------------");
          break;

        case MessageType.RECEIVE_NEXT_BLOCK:
          logger.info("-----------RECEIVE_NEXT_BLOCK-------------");
          addBlock(JSON.parse(JSON.stringify(message.data)));
          logger.info(JSON.stringify(blockchain));
          let nextBlockIndex = getLatestBlock().index + 1;
          logger.info("-- request next block @ index: " + nextBlockIndex);
          writeMessageToPeers(MessageType.REQUEST_BLOCK, {
            index: nextBlockIndex,
          });
          logger.info("-----------RECEIVE_NEXT_BLOCK-------------");
          break;

        case MessageType.RECEIVE_NEW_BLOCK:
          if (
            message.to === myPeerId.toString("hex") &&
            message.from !== myPeerId.toString("hex")
          ) {
            logger.info(
              "-----------RECEIVE_NEW_BLOCK------------- " + message.to
            );
            addBlock(JSON.parse(JSON.stringify(message.data)));
            logger.info(JSON.stringify(blockchain));
            logger.info(
              "-----------RECEIVE_NEW_BLOCK------------- " + message.to
            );
          }
          break;

        case MessageType.REQUEST_ALL_REGISTER_MINERS:
          logger.info(
            "-----------REQUEST_ALL_REGISTER_MINERS------------- " + message.to
          );
          writeMessageToPeers(MessageType.REGISTER_MINER, registeredMiners);
          registeredMiners = JSON.parse(JSON.stringify(message.data));
          logger.info(
            "-----------REQUEST_ALL_REGISTER_MINERS------------- " + message.to
          );
          break;

        case MessageType.REGISTER_MINER:
          logger.info("-----------REGISTER_MINER------------- " + message.to);
          let miners = JSON.stringify(message.data);
          registeredMiners = JSON.parse(miners);
          logger.info(registeredMiners);
          logger.info("-----------REGISTER_MINER------------- " + message.to);
          break;
      }
    });

    /*  
         listen to a close event, which will indicate that you 
         lost a connection with peers, so you can take action, such as delete
         the peers from your peers ist object. 
       */
    conn.on("close", () => {
      logger.info(`Connection ${seq} closed, peerId: ${peerId}`);
      if (peers[peerId]?.seq === seq) {
        delete peers[peerId];
        logger.info(
          "--- registeredMiners before: " + JSON.stringify(registeredMiners)
        );
        let index = registeredMiners.indexOf(peerId);
        if (index > -1) registeredMiners.splice(index, 1);
        logger.info(
          "--- registeredMiners end: " + JSON.stringify(registeredMiners)
        );
      }
    });

    if (!peers[peerId]) {
      peers[peerId] = {};
    }
    peers[peerId].conn = conn;
    peers[peerId].seq = seq;
    connSeq++;
  });
})();

// writeMessageToPeers method will be sending messages to all the connected peers
const writeMessageToPeers = (type, data) => {
  for (let id in peers) {
    logger.info("-------- writeMessageToPeers start -------- ");
    logger.info("type: " + type + ", to: " + id);
    logger.info("-------- writeMessageToPeers end ----------- ");
    sendMessage(id, type, data);
  }
};

// writeMessageToPeerToId, that will be sending the message to a specific peer ID
const writeMessageToPeerToId = (toId, type, data) => {
  for (let id in peers) {
    if (id === toId) {
      logger.info("-------- writeMessageToPeerToId start -------- ");
      logger.info("type: " + type + ", to: " + toId);
      logger.info("-------- writeMessageToPeerToId end ----------- ");
      sendMessage(id, type, data);
    }
  }
};

/* 
   sendMessage is a generic method that we will be using to send a
   message formatted with the params you would like to pass and includes the
   following:
     – to/from: The peer ID you are sending the message from and to
     – type: The message type
     – data: Any data you would like to share on the P2P network 
*/

const sendMessage = (id, type, data) => {
  peers[id].conn.write(
    JSON.stringify({
      to: id,
      from: myPeerId,
      type: type,
      data: data,
    })
  );
};

setTimeout(function () {
  writeMessageToPeers(MessageType.REQUEST_ALL_REGISTER_MINERS, null);
}, 5000);

// using a setTimeout function to send a message send a request to retrieve the latest block every 5 seconds
setTimeout(function () {
  writeMessageToPeers(MessageType.REQUEST_BLOCK, {
    index: getLatestBlock().index + 1,
  });
}, 5000);

setTimeout(function () {
  registeredMiners.push(myPeerId.toString("hex"));
  logger.info("----------Register my miner --------------");
  logger.info(registeredMiners);
  writeMessageToPeers(MessageType.REGISTER_MINER, registeredMiners);
  logger.info("---------- Register my miner --------------");
}, 7000);

const job = new CronJob("30 * * * * *", function () {
  let index = 0; // first block

  // requesting next block from your next miner
  if (lastBlockMinedBy) {
    let newIndex = registeredMiners.indexOf(lastBlockMinedBy);
    index = newIndex + 1 > registeredMiners.length - 1 ? 0 : newIndex + 1;
  }

  /*
      To generate and add a new block, you will be calling chain
      generateNextBlock and addBlock. Lastly, you will broadcast the new
      block to all the connected peers.
    */
  lastBlockMinedBy = registeredMiners[index];
  logger.info(
    "-- REQUESTING NEW BLOCK FROM: " +
      registeredMiners[index] +
      ", index: " +
      index
  );
  logger.info(JSON.stringify(registeredMiners));
  if (registeredMiners[index] === myPeerId.toString("hex")) {
    logger.info("-----------create next block -----------------");
    let newBlock = generateNextBlock(transactions);
    transactions = [];
    addBlock(newBlock);
    logger.info(JSON.stringify(newBlock));
    writeMessageToPeers(MessageType.RECEIVE_NEW_BLOCK, newBlock);
    // logger.info(JSON.stringify(chain.blockchain));
    logger.info("-----------create next block -----------------");
  }
});
job.start();

process.on("SIGINT", async function () {
  axios.delete(`${API_PORT}/blockchain/${PORT}`).then(() => {
    process.exit(0);
  });
});
