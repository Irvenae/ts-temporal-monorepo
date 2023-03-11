import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  projects: ["<rootDir>/packages/*"],
  setupFiles: ["dotenv/config"]
}

export default jestConfig;
