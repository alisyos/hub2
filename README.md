# AI Agent Hub PoC 페이지

다양한 AI 에이전트 서비스를 한곳에 모아 사용자와 관리자가 손쉽게 접근하고 관리할 수 있는 웹 애플리케이션입니다.

## 주요 기능

### 🔗 사용자 페이지
- AI 에이전트 서비스 목록 조회 및 카테고리별 필터링
- 서비스 정보 (명칭, 설명, 카테고리, 적용상태) 확인
- 사용자 페이지로 새 탭에서 이동
- 관리자 페이지로 이동 (URL이 있는 경우)
- 적용완료 서비스의 경우 agent.gptko.co.kr/agent로 이동

### ⚙️ 관리자 페이지
- AI 에이전트 서비스 등록, 수정, 삭제 (CRUD)
- 적용여부 상태 관리
- 모달을 통한 직관적인 폼 인터페이스
- 실시간 상태 토글

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **State Management**: React Context API

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

애플리케이션이 http://localhost:3000에서 실행됩니다.

### 3. 빌드
```bash
npm run build
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── UserPage.tsx    # 사용자 페이지
│   └── AdminPage.tsx   # 관리자 페이지
├── context/            # Context API
│   └── OutLinkContext.tsx
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── App.tsx             # 메인 앱 컴포넌트
├── main.tsx           # 애플리케이션 진입점
└── index.css          # 글로벌 스타일
```

## 데이터 구조

```typescript
interface OutLink {
  id: string;
  name: string;           // 서비스 명칭
  description: string;    // 서비스 설명
  category: string;       // 카테고리 (고객센터, 파트너사, 내부시스템 등)
  isApplied: boolean;     // 적용 여부
  userPageUrl: string;    // 사용자 페이지 URL
  adminPageUrl?: string;  // 관리자 페이지 URL (선택사항)
}
```

## 사용 방법

### 사용자 페이지 (/)
1. 등록된 AI 에이전트 서비스 목록을 확인합니다
2. 카테고리 필터를 사용하여 원하는 서비스를 찾습니다
3. "사용자 페이지" 버튼을 클릭하여 해당 서비스로 이동합니다
4. 관리자 페이지가 있는 경우 "관리자 페이지" 버튼을 클릭합니다
5. 적용완료된 서비스의 경우 "적용완료" 버튼을 클릭하여 agent 페이지로 이동합니다

### 관리자 페이지 (/admin)
1. "새 아웃링크 추가" 버튼을 클릭하여 새로운 서비스를 등록합니다
2. 기존 아웃링크의 "수정" 버튼을 클릭하여 정보를 업데이트합니다
3. "삭제" 버튼을 클릭하여 불필요한 아웃링크를 제거합니다
4. 적용 상태 배지를 클릭하여 적용여부를 토글합니다

## 라이선스

MIT License 