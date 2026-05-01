import * as discord from 'discord.js';

export type Config = {
    "client": discord.ClientOptions,
    "rest"?: Partial<discord.RESTOptions>,
    "presence"?: discord.PresenceData
};

export type Environments = {
    "token": string,
    "appId": string
};

//#region Command
export type CommandTree = {
    [key: string]: CommandModule | CommandTree
};

export type ApplicationCommandType = "chatInput" | "userContextMenu" | "messageContextMenu" | "primaryEntryPoint";

export type Command =
    ApplicationCommandChatInput |
    ApplicationCommandUserContextMenu |
    ApplicationCommandMessageContextMenu |
    ApplicationCommandPrimaryEntryPoint;

export type ApplicationCommandBase<T extends ApplicationCommandType, ADD = {}> = {
    "type": T
} & ADD;

export type ApplicationCommandChatInput = ApplicationCommandBase<"chatInput", {
    "description": string,
    "arguments"?: ApplicationCommandArguments[]
}>;

export type ApplicationCommandUserContextMenu = ApplicationCommandBase<"userContextMenu", {
    "description": string
}>;

export type ApplicationCommandMessageContextMenu = ApplicationCommandBase<"messageContextMenu", {
    "description": string
}>;

export type ApplicationCommandPrimaryEntryPoint = ApplicationCommandBase<"primaryEntryPoint", {
    "description": string,
    "handler": discord.EntryPointCommandHandlerType
}>;

export type ApplicationCommandChoice = {
    "name": string,
    "value": string | number
};

export type ApplicationCommandArgumentsBase<T = string, ADD = {}> = {
    "type": T,
    "name": string,
    "description": string,
    "required"?: boolean,
    "choices"?: ApplicationCommandChoice[]
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

//#region src/commands

export type CommandCallbackArgs<T extends ApplicationCommandType> = {
    "interaction": T extends "chatInput" ?
    discord.ChatInputCommandInteraction<discord.CacheType> :
    T extends "userContextMenu" ?
    discord.UserContextMenuCommandInteraction<discord.CacheType> :
    T extends "messageContextMenu" ?
    discord.MessageContextMenuCommandInteraction<discord.CacheType> :
    discord.PrimaryEntryPointCommandInteraction<discord.CacheType>;
    "client": discord.Client<true>
    "rest": discord.REST
};

export type CommandCallback<T extends ApplicationCommandType> = (props: CommandCallbackArgs<T>) => any;

export type CommandModule<T extends ApplicationCommandType = ApplicationCommandType> = {
    "command": Command,
    "callback": CommandCallback<T>;
};

//#endregion

//#region src/customs

export type CustomEventsMap = {
    "onStartup": [],
    "onStartupFinished": [],
    "onExit": [number],
    "onDjsDebug": [string],
    "onDjsWarn": [string],
    "onDjsError": [Error]
};

export type CustomEvents = keyof CustomEventsMap;
export type CustomCallback<K extends CustomEvents> = (...args: CustomEventsMap[K]) => any;

export type CustomModule<K extends CustomEvents = CustomEvents> = {
    "condition": K;
    "callback": CustomCallback<K>;
};

//#endregion

//#region src/events

export type Events = keyof Omit<discord.ClientEvents, "debug" | "warn" | "error">;
export type EventCallback<K extends Events> = (...args: discord.ClientEvents[K]) => any;

export type EventModule<K extends Events = Events> = {
    "eventName": K;
    "callback": EventCallback<K>;
};

//#endregion

//#region src/interactions

export type InteractionTypes = {
    "messageContextMenu": discord.MessageContextMenuCommandInteraction;
    "userContextMenu": discord.UserContextMenuCommandInteraction;
    "primaryEntryPoint": discord.PrimaryEntryPointCommandInteraction;
    "anySelectMenu": discord.AnySelectMenuInteraction;
    "button": discord.ButtonInteraction;
    "autoComplete": discord.AutocompleteInteraction;
    "modalSubmit": discord.ModalSubmitInteraction;
}

export type InteractionCallbackArgs<T extends keyof InteractionTypes> = {
    "interaction": InteractionTypes[T],
    "client": discord.Client<true>,
    "rest": discord.REST
};
export type InteractionCallback<T extends keyof InteractionTypes> = (args: InteractionCallbackArgs<T>) => any;

export type InteractionCondition<T extends keyof InteractionTypes> = {
    "type": T;
    "customId": string
};

export type InteractionModule<T extends keyof InteractionTypes = keyof InteractionTypes> = {
    "condition": InteractionCondition<T>,
    "callback": InteractionCallback<T>
};

//#endregion
