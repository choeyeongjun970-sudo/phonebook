# PRD: Phonebook Management System (전화번호 관리 시스템)

## 1. 개요 (Overview)
- **목적**: 사용자가 연락처 정보를 쉽고 안전하게 관리할 수 있는 웹 기반 전화번호부 시스템을 구축한다.
- **주요 가치**: 간결한 사용자 경험(UX), 강력한 보안(Supabase RLS), 그리고 최신 웹 기술 기반의 빠른 성능.

## 2. 기술 스택 (Tech Stack)
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Vanilla CSS (Modern, Premium UI Design)
- **Backend/Database**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel

## 3. 핵심 기능 (Functional Requirements)

### 3.1 연락처 관리 (CRUD)
- **추가**: 이름, 전화번호, 메모, **분류(Category)** 필드를 포함한 연락처 생성.
- **목록**: 전체 연락처 리스트 조회. (Infinite Scroll 방식 적용하여 대량 데이터 대응)
- **수정**: 기존 연락처의 이름, 전화번호, 메모, **분류** 정보를 수정.
- **삭제**: 연락처 삭제. (실수 방지를 위한 확인 모달 필수 적용)

### 3.2 분류 관리 (Category Management)
- **관리**: 분류 명칭을 추가, 수정, 삭제할 수 있는 관리 UI 제공. (예: 친구, 친척, 동아리 등)
- **필터링**: 목록 페이지에서 특정 분류별로 연락처를 필터링하여 볼 수 있는 기능.

### 3.2 검색 기능 (Search)
- **실시간 필터링**: 이름 또는 전화번호의 일부 키워드만으로 검색 결과 노출.
- **검색 최적화**: Postgres의 `ilike` 연산자를 활용한 부분 일치 검색 처리.

## 4. 데이터베이스 및 보안 (Security & Database)

### 4.1 DB 스키마 설계

#### `categories` 테이블
| 컬럼명 | 타입 | 제약사항 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | 분류 고유 식별자 |
| `name` | `text` | Not Null, Unique | 분류 명칭 (예: 친구, 친척) |

#### `contacts` 테이블
| 컬럼명 | 타입 | 제약사항 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK | 고유 식별자 |
| `created_at` | `timestamptz` | | 생성 일시 |
| `name` | `text` | Not Null (암호화) | 이름 |
| `phone_number` | `text` | Not Null (암호화) | 전화번호 |
| `memo` | `text` | | 간단한 메모 |
| `category_id` | `uuid` | FK (categories.id) | 소속 분류 |

### 4.2 보안 전략
- **데이터 암호화 (Data Encryption)**:
    - **개인정보 보호**: 사용자 이름(`name`)과 전화번호(`phone_number`)는 DB 저장 시 서비스 수준 또는 DB 레벨에서 고도의 암호화(AES-256 등)를 거쳐 저장한다.
    - **검색 처리**: 암호화된 필드에 대한 효율적인 검색을 위해 별도의 해시 인덱스 또는 애플리케이션 레벨의 처리를 검토한다.
- **Supabase RLS**: Row Level Security를 활성화하여 허가되지 않은 데이터 접근 차단.
- **Validation**: 클라이언트와 서버 양측에서 데이터 유효성 검사 수행 (전화번호 형식 등).

## 5. UI/UX 디자인 가이드 (Facebook Style Aesthetics)
- **핵심 컨셉**: Facebook 스타일의 친숙하고 신뢰감 있는 UI (Clean, Trusted, Social).
- **색상 팔레트**: 
    - Secondary: Facebook Blue (`#1877F2`)
    - Background: Light Gray (`#F0F2F5`) 또는 White
    - Text: Dark Gray (`#1C1E21`)
- **레이아웃 & 컴포넌트**:
    - **카드 기반 레이아웃**: 연락처 목록을 Facebook 피드와 같이 둥근 모서리와 그림자가 있는 카드 형태로 구현.
    - **반응형 사이드바**: 좌측에는 '분류(Category)' 목록, 중앙에는 '연락처 목록'을 배치하는 2단 구성.
- **인터랙션**: Facebook 특유의 부드러운 버튼 클릭감, 호버 시 배경색 변화 등 마이크로 애니메이션 적용.

## 6. 향후 확장성 (Roadmap)
- 연락처 그룹(카테고리) 기능 추가
- Supabase Auth를 통한 개인별 연락처 관리 기능
- 연락처 CSV 내보내기/가져오기 기능
