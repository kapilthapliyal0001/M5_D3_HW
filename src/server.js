import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

import blogRouter from "./blogPosts/index.js";

const server = express();
const PORT = 3001;

server.use(cors()); // global middleware

server.use(express.json()); // global middle ware

server.use("/posts", blogRouter);

console.log(listEndpoints(server)); // module which shows in list format

server.listen(PORT, function () {
  console.log("✅ Server is running on the port : ", PORT);
});

server.on("error", (error) => {
  console.log("❌ server is not running dur to : ", console.error());
});
