import mongoose from "mongoose";
import rolesSeeder from '../seeders/roles.seeder.js'

export const useMongoDB = (callback) => {
  mongoose
    .connect(process.env.DATABASE_CONNECTION_URL)
    .then(() => console.log("Database connection successful"))
    .then(async () => {
      await rolesSeeder.seed();
      if (callback) callback();
    })
    .catch(() => console.log("Database connection fail"));
};
