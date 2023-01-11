import elliptic from "elliptic";
const { ec: EC } = elliptic;

const ec = new EC("secp256k1");

const generatePrivateKey = () => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

export const initWallet = () => {
  const privateKey = generatePrivateKey();
  const key = ec.keyFromPrivate(privateKey, "hex");
  const publicKey = key.getPublic().encode("hex");
  return { publicKey, privateKey };
};
