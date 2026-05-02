# 상호작용 핸들링

이 문서는 [@pro203s/discord](https://npmjs.com/package/@pro203s/discord)를 사용할 때를 가정한 문서입니다.  

프로젝트 세팅이 되어있지 않다면 [시작하기](./gettingStarted.md)를 참고해주세요!  

## 1. 파일 만들기

1. `src/interactions` 폴더를 만들어주세요.  
2. `interactions` 폴더 안에 `button.ts` 파일을 만들어주세요.

예상 폴더 구조:
```
src/
└── interactions/
    └── button.ts
```

## 2. 코드 작성하기

> [!IMPORTANT]  
> 모든 타입 import는 `@pro203s/discord`에서 import합니다.

1. `InteractionCallbackArgs`, `InteractionCondition` 타입을 import합니다.

```typescript
import type { InteractionCallbackArgs, InteractionCondition } from "@pro203s/discord";
```

2. `InteractionCondition` 타입의 `condition`을 선언 후 export합니다.

```typescript
// 핸들할 상호작용 타입
const InteractionType = "button"; // keyof InteractionTypes

// typeof InteractionType = 위의 InteractionType의 타입 = "button"의 타입
export const condition: InteractionCondition<typeof InteractionType> = {
    "type": InteractionType,
    // wildcard 지원
    "customId": "*"
}
```

3. `InteractionCallback` 타입의 `callback` function을 선언 후 export합니다.

`InteractionCallback`의 타입은 아래와 같습니다.  

```typescript
type InteractionCallback<T extends keyof InteractionTypes> = (args: InteractionCallbackArgs<T>) => any;
```

`InteractionCallbackArgs`의 타입은 아래와 같습니다.

|키|값|
|-|-|
|interaction|type에 맞는 상호작용|
|client|discord.js의 Client|
|rest|discord.js의 REST|

```typescript
// typeof InteractionType = 위의 InteractionType의 타입 = "button"의 타입
export const callback = async ({ interaction }: InteractionCallbackArgs<typeof InteractionType>) => {
    return await interaction.reply("Pressed button with custom id " + interaction.customId);
};
```

## 3. 예제 코드

아래 예제는 `button` 타입의 상호작용을 핸들할 수 있는 코드입니다.  

```typescript
import type { InteractionCallbackArgs, InteractionCondition, InteractionTypes } from "@pro203s/discord";

const InteractionType: keyof InteractionTypes = "button";

export const condition: InteractionCondition<typeof InteractionType> = {
    "type": InteractionType,
    "customId": "*"
}

export const callback = async ({ interaction }: InteractionCallbackArgs<typeof InteractionType>) => {
    return await interaction.reply("Pressed button with custom id " + interaction.customId);
};
```
