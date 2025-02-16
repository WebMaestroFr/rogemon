import express from "express";
import path from "path";
import serverless from "serverless-http";

import api from "rogemon-api/src";

const staticRootPath = path.resolve(__dirname, "../client/dist");
console.log(`Serving static files from ${staticRootPath}`);
api.use("/", express.static(staticRootPath));

export const handler = serverless(api);
