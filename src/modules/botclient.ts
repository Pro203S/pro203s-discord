import { Client, ClientUser, REST, Routes } from "discord.js";
import Project from "./project";

export default class BotClient {
    private _client!: Client<true>;
    private _rest!: REST;

    public user!: ClientUser;

    constructor(
        private _project: Project
    ) { }

    async checkLoaded() {
        if (!this._client || !this._rest)
            throw new Error("Please load the BotClient first!");
    }

    async load() {
        await this._project.load();

        this._client = new Client(this._project.config.client);
        this._rest = new REST(this._project.config.rest).setToken(this._project.env.token);

        this._rest.put(Routes.applicationCommands(this._project.env.appId), {
            "body": this._project.getApplicationCommands()
        });
    }

    async start() {
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
}