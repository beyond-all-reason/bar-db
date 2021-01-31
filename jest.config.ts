import type {Config} from "@jest/types";

const config: Config.InitialOptions = {
    verbose: false,
    coveragePathIgnorePatterns: ["working-files"],
    modulePathIgnorePatterns: ["working-files"],
};
export default config;