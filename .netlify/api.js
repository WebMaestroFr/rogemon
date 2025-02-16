import serverless from "serverless-http";

import api from "../api/dist";

export const handler = serverless(api);
