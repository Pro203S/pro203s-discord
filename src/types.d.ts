import * as discord from 'discord.js';

export type Config = {
    "client"?: discord.ClientOptions,
    "rest"?: Partial<discord.RESTOptions>
};

export type Environments = {
    "token": string,
    "appId": string
};

//#region Interactions
export type ApplicationCommandType = "chatInput" | "user" | "message" | "primary_entry_point";
export type ApplicationCommand = {
    "type": ApplicationCommandType,
    "name": string,
    "description": string,
    "arguments"?: ApplicationCommandArguments[]
};

export type ApplicationCommandArgumentsBase<T = string, ADD = {}> = {
    "type": T,
    "name": string,
    "description": string,
    "required"?: boolean
} & Partial<ADD>;

export type ApplicationCommandArguments =
    ApplicationCommandArgumentsBase<"string", { "maxLength": number, "minLength": number }> |
    ApplicationCommandArgumentsBase<"integer", { "maxValue": number, "minValue": number }> |
    ApplicationCommandArgumentsBase<"boolean"> |
    ApplicationCommandArgumentsBase<"user"> |
    ApplicationCommandArgumentsBase<"channel"> |
    ApplicationCommandArgumentsBase<"role"> |
    ApplicationCommandArgumentsBase<"mentionable"> |
    ApplicationCommandArgumentsBase<"number", { "maxValue": number, "minValue": number }> |
    ApplicationCommandArgumentsBase<"attachment">;

//#endregion
