import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

export default config;
