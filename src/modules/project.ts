import * as fs from 'fs';
import path from 'path';
import {
    RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js';
import {
    CommandModule,
    CommandTree,
    Config,
    CustomModule,
    Environments,
    EventModule,
    InteractionModule
} from '../types';
import { getDefaultExport, loadModule } from './typescript';
import { isCommandModule, buildStandaloneCommand, buildGroupedChatInputCommand, resolveFilePath, getLoadableFiles, getModuleKey, insertCommandModule } from './commandHelper';

export default class Project {
    public env!: Environments;
    public config!: Config;

    public commands: CommandTree = {};
    public customs: CustomModule[] = [];
    public events: EventModule[] = [];
    public interactions: InteractionModule[] = [];

    constructor(
        public dir: string
    ) { }

    getApplicationCommands(): RESTPostAPIApplicationCommandsJSONBody[] {
        return Object.entries(this.commands)
            .map(([commandName, value]) => {
                if (isCommandModule(value))
                    return buildStandaloneCommand(commandName, value);

                return buildGroupedChatInputCommand(commandName, value, commandName);
            });
    }

    async load() {
        const root = fs.readdirSync(this.dir, "utf-8");

        if (!root.includes("src"))
            throw new Error("There are no source files.");

        //#region load env file
        const envPath = resolveFilePath(this.dir, "discord-env", true) as string;
        const envModule = await loadModule(envPath);
        const env: any = getDefaultExport(envModule);

        if (!(env && typeof env === "object" &&
            env?.token && typeof env?.token === "string" &&
            env?.appId && typeof env?.appId === "string")
        )
            throw new Error("discord-env file is malformed.");

        this.env = env as Environments;
        //#endregion

        //#region load config file
        await (async () => {
            const configPath = resolveFilePath(this.dir, "discord-config");
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
        //#endregion

        await this.reload("commands");
        await this.reload("customs");
        await this.reload("events");
        await this.reload("interactions");

        return;
    }

    async reload(type: "commands" | "customs" | "events" | "interactions") {
        switch (type) {
            case 'commands':
                await (async () => {
                    const commandPath = path.join(this.dir, "src", "commands");
                    this.commands = {};

                    if (!fs.existsSync(commandPath))
                        return;

                    const commandFiles = getLoadableFiles(commandPath);

                    for await (const commandFile of commandFiles) {
                        const commandKey = getModuleKey(commandPath, commandFile);
                        const module = getDefaultExport(await loadModule(commandFile)) as CommandModule;

                        if (!(
                            module.callback && typeof module.callback === "function" &&
                            module.command && typeof module.command === "object"
                        )) throw new Error("Invalid customs module from: " + commandFile);

                        insertCommandModule(this.commands, commandKey, module);
                    }
                })();
                return;
            case 'customs':
                await (async () => {
                    const srcPath = path.join(this.dir, "src", "customs");
                    if (!fs.existsSync(srcPath)) return;
                    const files = fs.readdirSync(srcPath, "utf-8").map(v => path.join(srcPath, v));

                    for await (const file of files) {
                        const module: CustomModule = await loadModule(file);

                        if (!(
                            module.callback && typeof module.callback === "function" &&
                            module.condition && typeof module.condition === "string"
                        )) throw new Error("Invalid custom module from: " + file);

                        this.customs.push(module);
                    }
                })();
                return;
            case 'events':
                await (async () => {
                    const srcPath = path.join(this.dir, "src", "events");
                    if (!fs.existsSync(srcPath)) return;
                    const files = fs.readdirSync(srcPath, "utf-8").map(v => path.join(srcPath, v));

                    for await (const file of files) {
                        const module: EventModule = await loadModule(file);

                        if (!(
                            module.callback && typeof module.callback === "function" &&
                            module.eventName && typeof module.eventName === "string"
                        )) throw new Error("Invalid event module from: " + file);

                        this.events.push(module)
                    }
                })();
                return;
            case 'interactions':
                await (async () => {
                    const srcPath = path.join(this.dir, "src", "interactions");
                    if (!fs.existsSync(srcPath)) return;
                    const files = fs.readdirSync(srcPath, "utf-8").map(v => path.join(srcPath, v));

                    for await (const file of files) {
                        const module: InteractionModule = await loadModule(file);

                        if (!(
                            module.callback && typeof module.callback === "function" &&
                            module.condition && typeof module.condition === "object" &&
                            module.condition.type && typeof module.condition.type === "string" &&
                            module.condition.customId && typeof module.condition.customId === "string"
                        )) throw new Error("Invalid interaction module from: " + file);

                        this.interactions.push(module)
                    }
                })();
                return;
        }
    }
}
