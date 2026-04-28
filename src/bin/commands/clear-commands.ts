import chalk from "chalk";
import { REST, RESTOptions, Routes } from "discord.js"
import ora from 'ora';
import Project from "../../modules/project";

async function Request(options: {
    "token": string,
    "appId": string,
    "restOptions"?: Partial<RESTOptions>
}) {
    const { token, appId, restOptions } = options;
    const spinner = ora(chalk.gray("Processing with application id " + appId.split("").map((v, i) => i >= 10 ? "*" : v).join("") + "...")).start();
    try {
        const rest = new REST(restOptions)
            .setToken(token);

        await rest.put(Routes.applicationCommands(appId), {
            "body": []
        });

        spinner.succeed("Cleared!");
    } catch (err) {
        throw err;
    } finally {
        spinner.stop();
        spinner.clear();
    }
}

export default async function ClearCommands() {
    const project = new Project(process.cwd());

    await Request({
        "token": project.env.token,
        "appId": project.env.appId,
        "restOptions": project.config.rest
    });
}