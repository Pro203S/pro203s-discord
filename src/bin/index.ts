#!/usr/bin/env node
import c from "chalk";
import * as fs from 'fs';
import ClearCommands from "./commands/clear-commands";
import Start from "./commands/start";

export const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const printVersion = () => {
    console.log();
    console.log(c.grey("@pro203s/discord v" + packageJson.version));
};

const helpMessage = () => {
    console.error(c.red("ERROR: No arguments provided."));
    console.log("Usage: npx discord [command]");
    console.log("Commands:");
    console.log("- start:          Starts the bot.");
    console.log("- clear-commands: Clears " + c.bold("all types of application commands."));

    printVersion();
};

(async () => {
    try {
        const command = process.argv[2];

        switch (command) {
            case "start":
                await Start();
                break;
            case "clear-commands":
                await ClearCommands();
                break;
            default:
                helpMessage();
                break;
        }
    } catch (err) {
        const e = err as Error;
        console.error(c.red("ERROR: " + e.message));
        console.error(c.gray(e.stack));

        printVersion();
    }
})();