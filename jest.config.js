export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        // You can override tsconfig options here
        noImplicitAny: false,
        strictNullChecks: false,
        strict: false
      }
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // Add this if you're using ECMAScript modules
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  },
};