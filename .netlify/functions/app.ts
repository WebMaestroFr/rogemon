import serverless from "serverless-http";

import api from "rogemon-api/src";

export const handler = serverless(api);
