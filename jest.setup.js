import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill ReadableStream
if (!global.ReadableStream) {
  global.ReadableStream = ReadableStream
}

// Mock crypto for jose
if (!global.crypto) {
  const { webcrypto } = require('crypto')
  global.crypto = webcrypto
}

// Mock Headers, Request, Response for Next.js
class MockHeaders extends Map {
  getSetCookie() {
    return []
  }
  get(name) {
    return super.get(name) || null
  }
}

global.Headers = MockHeaders

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'
process.env.NEXT_PUBLIC_API_KEY = 'test-api-key'
process.env.EMAIL_USER = 'test@example.com'
process.env.EMAIL_PASS = 'test-password'
process.env.NODE_ENV = 'test'
