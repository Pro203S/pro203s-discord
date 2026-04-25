import * as discord from 'discord.js';

export type Config = {
    "client": discord.ClientOptions,
    "rest": Partial<discord.RESTOptions>
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

export type ApplicationCommandArguments =
    ApplicationCommandArguments_String;

export type ApplicationCommandArguments_String = {
    "type": "string",
    "name": string,
    "description": string,
    "required"?: boolean,
    "maxLength"?: number,
    "minLength"?: number
};

export type ApplicationCommandArguments_Integer = {
    "type": "integer",
    "name": string,
    "description": string,
    "required"?: boolean,
    "maxValue"?: number,
    "minValue"?: number
};

export type ApplicationCommandArguments_User = {
    "type": "user",
    "name": string,
    "description": string,
    "required"?: boolean,
};



//#endregion
