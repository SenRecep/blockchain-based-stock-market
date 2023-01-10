import { ports } from "../../../store/blockchain-ports.store.js";
export const addPortRequest = (req, res) => {
  const port = +req.params.port;
  if (!ports.includes(port)) ports.push(port);
  res.json(ports);
};

export const getPortRequest = (req, res) => {
  res.json(ports);
};

export const removePortRequest = (req, res) => {
  const port = +req.params.port;
  if (ports.includes(port)) {
    const found = ports.findIndex((x) => x == port);
    ports.splice(found, 1);
  }
  res.json(ports);
};
