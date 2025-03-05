import serverless from 'serverless-http'

import api from '../../dist'

export const handler = serverless(api)
