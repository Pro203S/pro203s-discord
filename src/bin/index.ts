#!/usr/bin/env node
import c from "chalk";
import * as fs from 'fs';
import Project from "../modules/project";
import ClearCommands from "./commands/clear-commands";
import ora from "ora";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const helpMessage = () => {
    console.error(c.red("ERROR: No arguments provided."));
    console.log("Usage: npx discord [command]");
    console.log("Commands:");
    console.log("- start:          Starts the bot.");
    console.log("- clear-commands: Clears " + c.bold("all types of application commands."));
};

(async () => {
    const projectSpinner = ora("Loading project...").start();
    try {
        const command = process.argv[2];
        const project = new Project(process.cwd());
        await project.load();

        switch (command) {
            case "start":

                break;
            case "clear-commands":
                await ClearCommands({
                    "token": project.env.token,
                    "appId": project.env.appId,
                    "restOptions": project.config.rest
                });
                break;
            default:
                helpMessage();
                break;
        }
    } catch (err) {
        const e = err as Error;
        console.error(c.red("ERROR: " + e.message));
        console.error(c.gray(e.stack));
    } finally {
        projectSpinner.stop();
        projectSpinner.clear();

        console.log();
        console.log(c.grey("@pro203s/discord v" + packageJson.version));
    }
})();