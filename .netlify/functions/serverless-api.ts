import serverless from "serverless-http";

import api from "../../api/src";

export const handler = serverless(api);
