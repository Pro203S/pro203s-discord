# 커스텀 모듈

이 문서는 [@pro203s/discord](https://npmjs.com/package/@pro203s/discord)를 사용할 때를 가정한 문서입니다.  

프로젝트 세팅이 되어있지 않다면 [시작하기](./gettingStarted.md)를 참고해주세요!  

## 1. 커스텀 모듈이란?

봇의 특정 상황에서 실행되는 모듈입니다.  

|이벤트|설명|
|-|-|
|onStartup|봇을 시작할 때|
|onStartupFinished|봇이 준비되었을 때|
|onExit|프로세스가 종료될 때|
|onDjsDebug|discord.js의 debug 이벤트|
|onDjsWarn|discord.js의 warn 이벤트|
|onDjsError|discord.js의 error 이벤트|

## 2. 파일 만들기

1. `src/customs` 폴더를 만들어주세요.  
2. `customs` 폴더 안에 `debugLog.ts` 파일을 만들어주세요.

예상 폴더 구조:
```
src/
└── customs/
    └── debugLog.ts
```

## 3. 코드 작성하기

1. 타입 `CustomEvents`, `CustomCallback`를 import합니다.

```typescript
import type { CustomEvents, CustomCallback } from "@pro203s/discord";
```

2. `CustomEvents` 타입의 `condition`을 선언 후 export합니다.

```typescript
// discord.js의 debug
export const condition: CustomEvents = "onDjsDebug";
```

3. `CustomCallback` 타입의 `callback`을 선언 후 export합니다.

```typescript
export const callback: CustomCallback<typeof condition> = async (message) => {
    console.log("discord.js debug:", message);
};
```

## 4. 예제 코드

```typescript
import type { CustomEvents, CustomCallback } from "@pro203s/discord";

export const condition: CustomEvents = "onDjsDebug";

export const callback: CustomCallback<typeof condition> = async (message) => {
    console.log("discord.js debug:", message);
};
```
