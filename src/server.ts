import express from "express";
import dotenv from "dotenv";

dotenv.config();

var cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());
export default server;
