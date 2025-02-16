import serverless from "serverless-http";
import express from "express";

import api from "rogemon-api/src";

const app = express();

app.use(api);

app.use("/", express.static("client/dist"));

export const handler = serverless(api);
