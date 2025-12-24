const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/test/**/*.test.ts',
    '<rootDir>/test/**/*.test.tsx',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/test/api/',      // Skip API route tests (require Next.js runtime)
    '<rootDir>/test/middleware/', // Skip middleware tests (require Next.js runtime)
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/app/api/**', // Exclude API routes from coverage (tested separately)
    '!src/middleware/**', // Exclude middleware from coverage (tested separately)
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jose)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
