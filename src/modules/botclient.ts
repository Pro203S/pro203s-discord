import { Client, ClientUser, REST, Routes } from "discord.js";
import Project from "./project";
import { CustomEventsMap } from "../types";
import { EventEmitter } from 'node:stream';
import * as fs from 'fs';
import path from "node:path";
import chokidar from 'chokidar';
import lodash from 'lodash';

export default class BotClient {
    private _client!: Client<true>;
    private _rest!: REST;

    public user!: ClientUser;

    private _customModuleHandler!: EventEmitter<CustomEventsMap>;

    constructor(
        private _project: Project,
    ) {
        this._customModuleHandler = new EventEmitter();
    }

    private checkLoaded() {
        if (!this._client || !this._rest)
            throw new Error("Please load the BotClient first!");
    }

    async load() {
        await this._project.load();

        for (const custom of this._project.customs) {
            this._customModuleHandler.on(custom.condition, custom.callback);
        }

        process.on("beforeExit", (code) => this._customModuleHandler.emit("onExit", code));

        this._client = new Client(this._project.config.client);
        this._rest = new REST(this._project.config.rest).setToken(this._project.env.token);

        this._rest.put(Routes.applicationCommands(this._project.env.appId), {
            "body": this._project.getApplicationCommands()
        });
    }

    async start() {
        this.checkLoaded();
        this._client.login(this._project.env.token);

        await new Promise<void>((resolve) => {
            this._client.once("clientReady", (client) => {
                this.user = client.user;
                if (this._project.config.presence)
                    client.user.setPresence(this._project.config.presence);
                resolve();
            });
        });
    }

    async watch() {
        this.checkLoaded();

        const commandsPath = path.join(this._project.dir, "src", "commands");
        if (fs.existsSync(commandsPath)) {
            let infos = this._project.getApplicationCommands();

            const watcher = chokidar.watch(commandsPath, {
                "persistent": true,
                "ignoreInitial": true,
                "depth": Infinity,
                "atomic": true,
                "awaitWriteFinish": {
                    "stabilityThreshold": 200,
                    "pollInterval": 100
                }
            });

            watcher.on("all", async () => {
                await this._project.reload("commands");
                const now = this._project.getApplicationCommands();

                if (lodash.isEqual(infos, now))
                    return;

                console.log("  Reloading application commands...");
                infos = now;
                this._rest.put(Routes.applicationCommands(this._project.env.appId), {
                    "body": this._project.getApplicationCommands()
                });
            });
        }
    }
}
