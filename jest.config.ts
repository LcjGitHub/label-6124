import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "src/lib/calendar.ts",
  ],
  coverageThreshold: {
    "src/lib/calendar.ts": {
      lines: 40,
      functions: 20,
      branches: 30,
    },
  },
  verbose: true,
};

export default config;
