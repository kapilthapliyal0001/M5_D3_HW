//***************** PAKAGES **************** */
import express from "express";

import cors from "cors";

import listEndpoints from "express-list-endpoints";

import blogRouter from "./blogPosts/index.js";

import {
  catchErrorMiddleware,
  badRequestMiddleware,
  notFoundMiddleware,
} from "./errorMiddlewares.js";

const server = express();
const PORT = 3001;

const globalMiddleWareExp = (req, res, next) => {
  console.log(`Request -----> ${req.method} ${req.url} --- ${new Date()}`);
};

//***************GLOBAL MIDDLEWARE**********************/

server.use(cors()); // global middleware

server.use(express.json()); // global middle ware

server.use(globalMiddleWareExp); // using the global middle ware example

server.use("/posts", blogRouter);

//using error middlewares
server.use(notFoundMiddleware);
server.use(badRequestMiddleware);
server.use(catchErrorMiddleware);

console.table(listEndpoints(server)); // module which shows in list format

server.listen(PORT, function () {
  console.log("✅ Server is running on the port : ", PORT);
});

server.on("error", (error) => {
  console.log("❌ server is not running dur to : ", console.error());
});
