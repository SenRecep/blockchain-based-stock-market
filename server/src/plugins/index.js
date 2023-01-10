import { useMongoDB } from "./mongodb.plugin.js";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import express,{ json } from "express";
import { useRoutes } from "../routes/index.js";
import { errorHandlerMiddleware } from "../middlewares/errorHandler.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { notFoundMiddleware } from "../middlewares/notfound.middleware.js";
import morganConfig from "./morgan.plugin.js";

const usePlugins = (app) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename); 

  app.use(cors());
  app.use(json());
  app.use(express.urlencoded({extended:true}))

  app.use(express.static(path.join(__dirname,"../../files")))

  app.use(morgan(morganConfig));

  app.use(authMiddleware);
  useRoutes(app);
  app.use(errorHandlerMiddleware);
  app.use(notFoundMiddleware);
};

export { useMongoDB, usePlugins };
