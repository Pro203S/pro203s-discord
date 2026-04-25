#!/usr/bin/env node
import c from "chalk";
import * as fs from 'fs';
import Project from "../modules/project";
import ClearCommands from "./commands/clear-commands";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const helpMessage = () => {
    console.error(c.red("ERROR: No arguments provided."));
    console.log("Usage: npx discord [command]");
    console.log("Commands:");
    console.log("- start:          Starts the bot.");
    console.log("- clear-commands: Clears " + c.bold("all types of application commands."));
};

(async () => {
    try {
        const command = process.argv[2];
        const project = new Project(process.cwd());

        switch (command) {
            case "start":

                break;
            case "clear-commands":
                await ClearCommands({
                    "token": "asdf",
                    "appId": "123124812958192581"
                });
                break;
            default:
                helpMessage();
                break;
        }
    } finally {
        console.log();
        console.log(c.grey("@pro203s/discord v" + packageJson.version));
    }
})();