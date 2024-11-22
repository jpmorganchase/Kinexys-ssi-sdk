/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/?(*.)+(spec|test).[jt]s?(x)'],
    testPathIgnorePatterns: ["hardhat"],
    testTimeout: 60000,
    coverageReporters: [
        ['lcov', { projectRoot: '../' }],
        'text-summary',
    ],
    transformIgnorePatterns: ["/node_modules/(?!key-did-resolver/)"],
    transform: {
        // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'configs/tsconfig.esm.json',
            },
        ],
    },
};
