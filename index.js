import cors from "cors";
import config from "./src/config.js";
import express from "express";
import knex from "knex";
import userRoute from "./src/routes/users.js";
import { Model } from "objection";

const app = express();
const db = knex(config.db);
Model.knex(db);

app.use(
  cors({
    origin: process.env.WEB_APP_ORIGIN,
  })
);
app.use(express.json());
userRoute({ app, db });

app.listen(config.port, () => console.log(`listening on:${config.port}`));

export default config;
