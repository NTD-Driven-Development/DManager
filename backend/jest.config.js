/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    coverageDirectory: "coverage",
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js'],
};