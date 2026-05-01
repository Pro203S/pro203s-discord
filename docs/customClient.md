# 커스텀 클라이언트 만들기

이 문서는 [@pro203s/discord](https://npmjs.com/package/@pro203s/discord)를 사용할 때를 가정한 문서입니다.  

프로젝트 세팅이 되어있지 않다면 [시작하기](./gettingStarted.md)를 참고해주세요!  

## 1. TypeScript 메인 소스 파일 만들기

메인으로 실행할 TypeScript 소스 파일 하나를 만들어주세요.  

기준이 되는 폴더 구조:  
```
src/
└── commands/
    └── ping.ts
index.ts <-- 커스텀 클라이언트 파일
```

## 2. 소스 작성

아래처럼 소스 코드를 작성합니다.

```typescript
import { BotClient, Project } from '@pro203s/discord';

(async () => {
    // Project는 무조건 절대 경로로 초기화해야합니다.
    // __dirname은 현재 프로세스의 작업 디렉토리를 나타냅니다.
    const project = new Project(__dirname);
    const client = new BotClient(project);

    // 프로젝트와 클라이언트를 둘 다 로드합니다.
    await client.load();

    // 봇을 시작합니다.
    await client.start();
})();
```

## 3. package.json 수정

### 3-1. ts-node 사용 시

1. `npm i typescript -D`로 TypeScript를 설치해주세요.
2. `package.json`의 `scripts`를 아래와 같이 수정해주세요.

```json
"scripts": {
    "start": "ts-node index.ts",
}
```

### 3-2. bun 사용 시

1. [bun을 설치](https://bun.com/)해주세요.
2. `package.json`의 `scripts`를 아래와 같이 수정해주세요.

```json
"scripts": {
    "start": "bun index.ts",
}
```
