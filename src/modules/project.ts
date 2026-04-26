import * as fs from 'fs';
import { Config, Environments } from '../types';
import path from 'path';
import { getDefaultExport, loadModule } from './typescript';
import c from 'chalk';

export default class Project {
    public env!: Environments;
    public config!: Config;

    constructor(
        private _dir: string
    ) { }

    private resolveFilePath(moduleName: string, throwWhenNotFound?: boolean) {
        const possibleFileNames = [
            `${moduleName}.ts`,
            `${moduleName}.js`,
            `${moduleName}.cjs`,
            `${moduleName}.mjs`
        ];
        for (const fileName of possibleFileNames) {
            const filePath = path.join(this._dir, fileName);

            if (fs.existsSync(filePath))
                return filePath;
        }

        if (throwWhenNotFound)
            throw new Error(`Cannot find ${possibleFileNames.join("/")} in the project root.`);

        return;
    }

    async load() {
        const root = fs.readdirSync(this._dir, "utf-8");

        if (!root.includes("src"))
            throw new Error("There are no source files.");

        // load env file

        const envPath = this.resolveFilePath("discord-env", true) as string;
        const envModule = await loadModule(envPath);
        const env: any = getDefaultExport(envModule);

        if (!(env && typeof env === "object" &&
            env?.token && typeof env?.token === "string" &&
            env?.appId && typeof env?.appId === "string")
        )
            throw new Error("discord-env file is malformed.");

        this.env = env as Environments;

        // load config file

        await (async () => {
            const configPath = this.resolveFilePath("discord-config");
            if (!configPath) {
                //console.warn(c.yellow("Cannot find discord-config file in project root.\nSkipping..."));
                return;
            }
            const configModule = await loadModule(configPath);
            const config: any = getDefaultExport(configModule);

            if (!(config && typeof config === "object" &&
                (config?.rest || typeof config.rest === "object") ||
                (config?.client || typeof config.client === "object"))
            )
                throw new Error("discord-config file is malformed.");

            this.config = config;
        })();


    }
}
