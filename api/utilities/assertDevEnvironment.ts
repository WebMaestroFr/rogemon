export default function assertDevEnvironment(NODE_ENV = process.env.NODE_ENV) {
  if (NODE_ENV !== 'development') {
    throw new Error('This is a development only feature')
  }
}
