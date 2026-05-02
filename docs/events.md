# 이벤트 핸들링

이 문서는 [@pro203s/discord](https://npmjs.com/package/@pro203s/discord)를 사용할 때를 가정한 문서입니다.  

프로젝트 세팅이 되어있지 않다면 [시작하기](./gettingStarted.md)를 참고해주세요!  

## 1. 파일 만들기

1. `src/events` 폴더를 만들어주세요.  
2. `events` 폴더 안에 `clientReady.ts` 파일을 만들어주세요.

예상 폴더 구조:
```
src/
└── events/
    └── clientReady.ts
```

## 2. 코드 작성하기

1. `Events`, `EventCallback` 타입을 import합니다.

```typescript
import type { Events, EventCallback } from "@pro203s/discord";
```

2. `Events` 타입의 `eventName`을 선언 후 export합니다.

`Events` 타입은 discord.js의 `ClientEvents`의 keyof와 같습니다.  

```typescript
// discord.js의 clientReady
export const eventName: Events = "clientReady";
```

3. `EventCallback` 타입의 `callback` 함수를 선언 후 export합니다.

```typescript
// EventCallback<"clientReady">는 함수의 파라메터로 discord.js의 Client<true>를 제공합니다.
export const callback: EventCallback<typeof eventName> = async (client) => {
    // 봇의 이름과 태그를 가져와 출력합니다.
    console.log("Bot info: " + client.user.displayName + "#" + client.user.discriminator);
};
```

## 3. 예제 코드

```typescript
import type { Events, EventCallback } from "@pro203s/discord";

export const eventName: Events = "clientReady";

export const callback: EventCallback<typeof eventName> = async (client) => {
    console.log("Bot info: " + client.user.displayName + "#" + client.user.discriminator);
};
```
