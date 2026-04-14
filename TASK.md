# 작업 목록 (TASK.md)

- [x] **1단계: 환경 및 프로젝트 설정**
    - [x] `npx -y create-next-app@latest ./ --typescript --tailwind=false --eslint --app --src-dir=false --import-alias="@/*"`
    - [x] 필수 라이브러리 설치: `@supabase/supabase-js`, `lucide-react`, `crypto-js`
    - [x] 환경 변수 설정 (`.env.local`): Supabase URL, Anon Key, Encryption Key

- [x] **2단계: 데이터베이스 및 Supabase 구성**
    - [x] Supabase에서 `categories` 테이블 생성
    - [ ] Connect to GitHub (Username: choeyeongjun970)
    - [x] `contacts` 테이블 생성 (이름, 전화번호, 메모, category_id 포함)
    - [x] 테이블별 RLS(Row Level Security) 활성화 및 보안 정책 설정

- [x] **3단계: 핵심 로직 및 유틸리티 구현**
    - [x] `utils/crypto.ts`: AES-256-GCM 기반 암복호화 유틸리티 구현
    - [x] `utils/supabase.ts`: Supabase 클라이언트 설정
    - [x] 연락처 서버 액션: 추가, 조회, 수정, 삭제 기능 구현
    - [x] 분류(Category) 서버 액션: 추가, 조회, 삭제 기능 구현

- [x] **4단계: 디자인 시스템 및 레이아웃 (페이스북 스타일)**
    - [x] `app/globals.css`: 글로벌 CSS 변수(페이스북 블루, 배경색 등) 정의
    - [x] `app/layout.tsx`: 2단 레이아웃(사이드바 + 컨텐츠 영역) 구성
    - [x] 페이스북 감성의 공통 UI 컴포넌트(버튼, 입력창, 모달) 제작

- [x] **5단계: 주요 기능 개발**
    - [x] **사이드바**: 카테고리 목록 표시 및 관리 UI 구현
    - [x] **연락처 폼**: 모달 형태의 연락처 추가/수정 폼 구현 (유효성 검사 포함)
    - [x] **연락처 목록**: 페이스북 카드 형태의 목록 및 무한 스크롤 구현
    - [x] **검색**: 암호화된 데이터를 복호화하여 처리하는 실시간 검색 로직 통합

- [x] **6단계: 최종 점검 및 다듬기**
    - [x] Supabase 대시보드에서 데이터 암호화 상태 확인
    - [x] 부분 일치 검색 기능 정상 동작 여부 테스트
    - [x] 반응형 디자인(모바일/데스크톱) 최적화
    - [x] UI/UX 애니메이션 및 트랜지션 디테일 수정

---
**모든 작업이 완료되었습니다!**
