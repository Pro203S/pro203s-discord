# 시작하기

## 1. 자동으로 만들기

1. `npx @pro203s/create-discord-bot`를 터미널에 입력합니다.
2. 절차에 따라 진행해주세요.

## 2. 수동으로 만들기

### 2-1. 모듈 설치하기

아래 명령어로 모듈을 설치할 수 있어요.  

```bash
npm install @pro203s/discord
```

### 2-2. package.json 수정

`package.json`의 `scripts`를 아래와 같이 수정해주세요.

```json
"scripts": {
    "start": "discord start",
}
```

### 2-3. 기본 폴더 세팅

프로젝트의 폴더 구조를 아래와 같이 세팅해주세요.  

```
src/
├── commands
├── events
├── interactions
└── plugins
package.json
discord-env.ts
```

### 2-4. Git을 사용할 때

`.gitignore`에 아래 내용을 추가해주세요.  

```ini
discord-env.ts
```

### 2-5. 파일 생성하기

1. 프로젝트 루트에 `discord-env.ts` 파일을 만들고 아래와 같이 내용을 수정해주세요.

```typescript
import { Environment } from '@pro203s/discord';

const env: Environment = {
    "token": "당신의 디스코드 봇 토큰을 여기에 넣어주세요",
    "appId": "당신의 디스코드 애플리케이션 ID를 여기에 넣어주세요"
};

export default env;
```

2. `src/commands`폴더에 TypeScript 소스 파일을 하나 만들고, 아래와 같이 내용을 수정해주세요.

```typescript
export const info: 
```

3. `npm run start`로 봇을 실행해봅시다!
