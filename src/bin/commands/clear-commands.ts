import chalk from "chalk";
import { REST, RESTOptions, Routes } from "discord.js"
import ora from 'ora';

export default async function ClearCommands(options: {
    "token": string,
    "appId": string,
    "restOptions"?: Partial<RESTOptions>
}) {
    const { token, appId, restOptions } = options;

    const spinner = ora(chalk.gray("Processing with application id " + appId.slice(0, 10) + "..."));
    spinner.start();

    const rest = new REST(restOptions)
        .setToken(token);

    await rest.put(Routes.applicationCommands(appId), {
        "body": []
    });

    spinner.succeed("Cleared!");
}