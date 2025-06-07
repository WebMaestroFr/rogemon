import { ObjectId } from 'mongodb'
import { vi } from 'vitest'

export default function mockUser() {
  return {
    _id: new ObjectId(),
    email: 'test@example.com',
    password: 'password123',
    comparePassword: vi.fn(),
  }
}
