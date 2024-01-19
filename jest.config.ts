import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    collectCoverage: true,
    coverageReporters: ['json', 'text', 'html'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
};
export default config;
