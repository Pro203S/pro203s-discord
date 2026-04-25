#!/usr/bin/env node
import c from "chalk";
import * as fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const helpMessage = () => {
    console.error(c.red("ERROR: No arguments provided."));
    console.log("Usage: npx discord [command]");
    console.log("Commands:");
    console.log("- start:          Starts the bot.");
    console.log("- clear-commands: Clears all commands.");
};

(async () => {
    try {
        const command = process.argv[2];

        switch (command) {
            case "start":

                break;
            case "clear-commands":
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