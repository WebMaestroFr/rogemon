import { type Server, createServer } from 'net'
import { vi } from 'vitest'

export default function mockNet() {
  vi.mock('net', async (importOriginal) => {
    const actualNet = await importOriginal<typeof import('net')>()
    return {
      ...actualNet,
      createServer: vi.fn(),
    }
  })
}

export function mockNetServer(mock?: Partial<Server>) {
  const mockServer = {
    listen: vi.fn().mockReturnThis(),
    on: vi.fn((event, callback) => {
      if (event === 'listening') {
        callback()
      }
      return mockServer
    }),
    close: vi.fn(),
    ...mock,
  } as Server
  vi.mocked(createServer).mockReturnValue(mockServer)
  return mockServer
}
