import { REST, RESTOptions, Routes } from "discord.js"

export default async function ClearCommands(options: {
    "token": string,
    "appId": string,
    "restOptions": Partial<RESTOptions>
}) {
    const { token, appId, restOptions } = options;
    const rest = new REST(restOptions)
        .setToken(token);

    await rest.put(Routes.applicationCommands(appId), {
        "body": []
    });
}