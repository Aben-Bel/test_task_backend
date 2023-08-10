import express from "express";
import dotenv from "dotenv";

dotenv.config();

let cors = require("cors");

const server = express();
server.use(
  cors({
    origin: "http://localhost:4000/",
  })
);
server.use(express.json());
export default server;
