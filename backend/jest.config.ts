import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest/presets/default', // more modern preset
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  testMatch: ['**/*.spec.ts'],
  modulePathIgnorePatterns: ['dist'],
};

export default config;
