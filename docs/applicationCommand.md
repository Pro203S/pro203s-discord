# 애플리케이션 명령어 만들기

이 문서는 [@pro203s/discord](https://npmjs.com/package/@pro203s/discord)를 사용할 때를 가정한 문서입니다.  

프로젝트 세팅이 되어있지 않다면 [시작하기](./gettingStarted.md)를 참고해주세요!  

## 1. 파일 만들기

1. `src/commands` 폴더를 만들어주세요.  
2. `commands` 폴더 안에 `ping.ts` 파일을 만들어주세요.

예상 폴더 구조:
```
src/
└── commands/
    └── ping.ts
```

만약 서브 커맨드, 서브 커맨드 그룹을 만들고 싶으시다면 아래 폴더 구조를 참고해 만들어주세요.  

```
src/
└── commands/
    └── subcommandgroup/
        ├── subcommand/
        │   └── command.ts
        └── command.ts
```

명령어의 이름은 파일 이름으로 정해집니다.  

## 2. 코드 작성하기

> [!IMPORTANT]  
> 모든 타입 import는 `@pro203s/discord`에서 import합니다.

1. 아래 두 타입들을 가져옵니다.

```typescript
import type { Command, CommandCallbackArgs } from "@pro203s/discord";
```

2. `Command` 타입 오브젝트 `command`를 선언 후 export합니다.

`command`의 `type`에는 아래 값이 들어갈 수 있습니다.

### Command Type 값

|type 값|설명|
|-|-|
|chatInput|슬래시(/) 커맨드|
|userContextMenu|유저 컨텍스트 메뉴 명령어|
|userContextMenu|메시지 컨텍스트 메뉴 명령어|
|primaryEntryPoint|디스코드의 활동에서 실행할 수 있는 명령어|

아래 예제 코드는 슬래시(/) 커맨드를 만듭니다.

```typescript
export const command: Command = {
    "description": "핑",
    "type": "chatInput"
};
```

3. `CommandCallback` 타입 function `callback`을 선언 후 export합니다.

`CommandCallback`의 타입은 아래와 같습니다.  
`ApplicationCommandType`은 [Command Type 값](#command-type-값)과 같습니다.  

```typescript
type CommandCallback<T extends ApplicationCommandType> = (props: CommandCallbackArgs<T>) => any;
```

`CommandCallbackArgs`의 타입은 아래와 같습니다.

|키|값|
|-|-|
|interaction|type에 맞는 상호작용|
|client|discord.js의 Client|
|rest|discord.js의 REST|

아래 예제 코드는 `command` 오브젝트의 `type`이 `chatInput`일 때 콜백 함수입니다.  

```typescript
export const callback = async ({ interaction }: CommandCallbackArgs<"chatInput">) => {
    return await interaction.reply("퐁");
};
```

## 3. 예제 코드

### 3-1. 슬래시(/) 커맨드

```typescript
import type { Command, CommandCallbackArgs } from "@pro203s/discord";

export const command: Command = {
    "description": "핑",
    "type": "chatInput"
};

export const callback = async ({ interaction }: CommandCallbackArgs<"chatInput">) => {
    return await interaction.reply("퐁");
};
```

### 3-2. 사용자 컨텍스트 메뉴

```typescript
import type { Command, CommandCallbackArgs } from "@pro203s/discord";

export const command: Command = {
    "type": "userContextMenu"
};

export const callback = async ({ interaction }: CommandCallbackArgs<"userContextMenu">) => {
    return await interaction.reply(interaction.targetUser.displayName);
};
```

### 3-3. 메시지 컨텍스트 메뉴

```typescript
import type { Command, CommandCallbackArgs } from "@pro203s/discord";

export const command: Command = {
    "type": "messageContextMenu"
};

export const callback = async ({ interaction }: CommandCallbackArgs<"messageContextMenu">) => {
    return await interaction.reply(interaction.targetMessage.content);
};
```

### 3-4. 주 진입점

```typescript
import type { Command, CommandCallbackArgs } from "@pro203s/discord";

export const command: Command = {
    "description": "앱 주 진입점",
    "type": "primaryEntryPoint",
    "handler": 1 // AppHandler
};

export const callback = async ({ interaction }: CommandCallbackArgs<"primaryEntryPoint">) => {
    return await interaction.reply("주 진입점");
};
```
