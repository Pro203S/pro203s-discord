import * as fs from 'fs';
import { Config, Environments } from '../types';
import path from 'path';
import { pathToFileURL } from 'url';
import { getDefaultExport, loadTypeScriptModule } from './typescript';

const ENV_FILE_NAMES = [
    "discord-env.ts",
    "discord-env.js",
    "discord-env.cjs",
    "discord-env.mjs"
] as const;

const isEnvironments = (value: unknown): value is Environments => {
    return typeof value === "object" &&
        value !== null &&
        "token" in value &&
        typeof value.token === "string" &&
        "appId" in value &&
        typeof value.appId === "string";
};

const hasErrorCode = (error: unknown, code: string): boolean => {
    return typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { "code"?: unknown }).code === code;
};

export default class Project {
    public env!: Environments;
    public config!: Config;

    constructor(
        private _dir: string
    ) { }

    private resolveEnvironmentFilePath() {
        for (const fileName of ENV_FILE_NAMES) {
            const filePath = path.join(this._dir, fileName);

            if (fs.existsSync(filePath))
                return filePath;
        }

        throw new Error("Cannot find discord-env.ts/js/cjs/mjs in the project root.");
    }

    private async loadEnvironmentModule(filePath: string) {
        const extension = path.extname(filePath);

        if (extension === ".ts")
            return loadTypeScriptModule(filePath);

        if (extension === ".mjs")
            return import(pathToFileURL(filePath).href);

        try {
            return require(filePath);
        } catch (error) {
            if (hasErrorCode(error, "ERR_REQUIRE_ESM"))
                return import(pathToFileURL(filePath).href);

            throw error;
        }
    }

    async load() {
        const root = fs.readdirSync(this._dir, "utf-8");

        if (!root.includes("src"))
            throw new Error("There are no source files.");

        // load env file

        const envPath = this.resolveEnvironmentFilePath();
        const envModule = await this.loadEnvironmentModule(envPath);
        const env = getDefaultExport(envModule);

        if (!isEnvironments(env))
            throw new Error("discord-env file must export a default object with string token and appId values.");

        this.env = env;
    }
}
