/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.(t|j)s?(x)',
    '**/*.(test|spec).(t|j)s?(x)',
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/tests/**',
  ],
  passWithNoTests: true,
  coverageReporters: ['text', 'json', 'html', 'lcov'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
