# 🚀 Blog & Todo App

**실무급 풀스택 개발**을 위한 Next.js 기반 블로그 및 Todo 애플리케이션입니다.

> 🎯 **실무에서 바로 사용할 수 있는 수준의 코드 품질과 아키텍처**

## 📋 프로젝트 개요

- **프레임워크**: Next.js 15.4.2 (App Router)
- **언어**: TypeScript
- **데이터베이스**: MySQL
- **ORM**: Prisma
- **스타일링**: SCSS
- **배포**: 가비아 호스팅 (1vCore | 2GB | 50GB HDD | Linux)

## 🎯 목표

**실무급 멀티 앱 블로그 시스템 구축**

- 📝 블로그 (글쓰기, 카테고리)
- ✅ Todo App (할일 관리)
- 📊 Dashboard (통계, 차트)
- 🎨 Portfolio (프로젝트 소개)
- 💬 Guestbook (방명록)
- 🔧 Tools (유틸리티 도구들)

## 🏢 실무 수준의 특징

### 🏗️ **엔터프라이즈급 아키텍처**

- **Clean Architecture** 적용으로 관심사 분리
- **Repository Pattern**으로 데이터 접근 추상화
- **Service Layer**로 비즈니스 로직 분리
- **Type Safety** 완벽 보장 (TypeScript)

### 🔒 **보안 및 안정성**

- **SQL Injection 방지** (Prisma ORM 사용)
- **XSS 방지** (Next.js 기본 보안)
- **에러 핸들링** 체계화 (Repository Pattern)
- **SSL 인증서** 자동 설정 (Let's Encrypt)

### 📈 **확장성 및 유지보수성**

- **모듈화된 타입 시스템** (types 폴더)
- **재사용 가능한 Repository** 패턴
- **일관된 코딩 컨벤션** (TypeScript)
- **표준화된 API 응답** 형식

### 🚀 **성능 최적화**

- **Next.js App Router** 사용
- **Prisma** 효율적인 데이터베이스 쿼리
- **모듈화된 구조**로 번들 크기 최적화
- **PM2** 프로세스 관리로 안정성 확보

## 🏗️ 아키텍처

### Clean Architecture 적용

```
src/
├── types/           # 타입 정의
├── lib/             # 라이브러리 설정
├── services/        # 비즈니스 로직
├── repositories/    # 데이터 접근 계층
├── components/      # React 컴포넌트
├── app/             # Next.js App Router
└── styles/          # SCSS 스타일
```

### 데이터베이스 설계

```sql
-- Todo 테이블 (현재 구현됨)
Todo {
  id: number (PK, auto increment)
  title: string
  description?: string
  completed: boolean
  priority: enum (LOW, MEDIUM, HIGH)
  createdAt: DateTime
  updatedAt: DateTime
}

-- 향후 추가 예정
User, Post, Category, Comment, Project, Guestbook
```

## 🚀 현재 구현 상태

### ✅ 완료된 기능

- Next.js 프로젝트 설정
- TypeScript 설정
- Prisma + MySQL 연결
- Todo 데이터베이스 스키마
- 타입 시스템 구축
- API 응답 타입 정의
- Repository Pattern 구현
- Service Layer 구현 (진행 중)
- 기본 파일 구조 생성
- GitHub 저장소 설정
- 가비아 서버 배포 및 SSL 설정

### 🔄 진행 중

- ⏳ Service Layer 구현 (기본 CRUD 메서드 완료)
- ⏳ Todo CRUD API 구현
- ⏳ 프론트엔드 컴포넌트 개발

### 📋 예정 기능

- 🔮 사용자 인증 (JWT + OAuth)
- 🔮 블로그 시스템
- 🔮 포트폴리오
- 🔮 대시보드
- 🔮 방명록
- 🔮 관리자 패널

## 🛠️ 기술 스택

### Frontend

- **Next.js 15.4.2** - React 프레임워크
- **TypeScript 5** - 타입 안전성
- **SCSS** - 스타일링
- **React 19.1.0** - UI 라이브러리

### Backend

- **Next.js API Routes** - 백엔드 API
- **Prisma** - ORM
- **MySQL** - 데이터베이스

### Development

- **ESLint** - 코드 품질
- **Turbopack** - 빠른 개발 서버

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── todos/           # Todo API
│   ├── todo/               # Todo 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 메인 페이지
├── components/
│   ├── TodoApp.tsx         # Todo 앱 컴포넌트
│   ├── Header.tsx          # 헤더 컴포넌트
│   └── Footer.tsx          # 푸터 컴포넌트
├── lib/
│   └── prisma.ts           # Prisma 클라이언트
├── types/
│   ├── todo.ts             # Todo 타입
│   ├── api.ts              # API 응답 타입
│   └── utils.ts            # 유틸리티 타입
└── styles/
    ├── globals.scss        # 전역 스타일
    └── components/         # 컴포넌트별 스타일
        ├── _header.scss
        └── _todo.scss
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/memoriz2/blog.git
cd blog
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

```bash
# .env 파일 생성
DATABASE_URL="mysql://username:password@localhost:3306/blog_db"
```

### 4. 데이터베이스 마이그레이션

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. 개발 서버 실행

```bash
npm run dev
```

## 📊 API 엔드포인트

### Todo API

- `GET /api/todos` - Todo 목록 조회
- `POST /api/todos` - 새 Todo 생성
- `PUT /api/todos/[id]` - Todo 수정
- `DELETE /api/todos/[id]` - Todo 삭제

## 🎨 브랜드 컬러 팔레트

### 백조 컨셉 브랜드 색상

현재 프로젝트는 **백조에서 영감받은 골드톤과 차콜의 조화**를 기반으로 한 브랜드 컬러 팔레트를 사용합니다.

#### 🎨 **메인 컬러**

- **Primary**: `#F8C300` (백조 부리 골드톤)
- **Primary Hover**: `#FFD886` (따뜻한 옐로우)
- **Primary Light**: `#FFF5D7` (햇살 번진 감성 배경)
- **Primary Dark**: `#E6B800` (진한 골드)

#### 🎨 **배경 컬러**

- **Background**: `#F7F7F7` (백조 깃털 순백톤)
- **Foreground**: `#2E2E2E` (구조적 차콜 톤)
- **Muted**: `#AAAAAA` (중성 회색)

#### 🎨 **UI 컴포넌트 색상**

- **Header**: `#2C3E50` (차콜) 배경 + `#F8C300` (골드) 글씨
- **Sidebar**: `#2C3E50` (차콜) 배경 + `#F7F7F7` (순백톤) 글씨
- **Card Background**: `#F7F7F7` (백조 깃털 순백톤)
- **Card Hover**: `#FFF5D7` (햇살 번진 감성 배경)
- **Organization List Item**: `#F7F7F7` 배경 + `#FFF5D7` 호버

#### 🎨 **상태 색상**

- **Success**: `#48BB78` (성공 그린)
- **Warning**: `#ED8936` (경고 오렌지)
- **Error**: `#F56565` (에러 레드)
- **Info**: `#4299E1` (정보 블루)

#### 🎨 **그라데이션**

- **Primary Gradient**: `linear-gradient(135deg, #F8C300 0%, #FFD886 100%)`
- **Secondary Gradient**: `linear-gradient(135deg, #FFF5D7 0%, #F8C300 100%)`

### 🎨 **색상 적용 예시**

```scss
// CSS 변수 정의
:root {
  --primary: #f8c300;
  --primary-hover: #ffd886;
  --primary-light: #fff5d7;
  --background: #f7f7f7;
  --foreground: #2e2e2e;
  --sidebar-bg: #2c3e50;
  --sidebar-text: #f7f7f7;
}

// 컴포넌트별 적용
.admin-portal {
  header {
    background: var(--sidebar-bg); // 차콜
    color: var(--primary); // 골드
  }

  aside {
    background: var(--sidebar-bg); // 차콜
    color: var(--sidebar-text); // 순백톤
  }

  .card {
    background: #f7f7f7; // 백조 깃털 순백톤
  }
}
```

### 🎨 **디자인 철학**

- **백조의 우아함**: 깔끔하고 세련된 골드톤으로 브랜드 아이덴티티 표현
- **차콜의 안정감**: 헤더와 사이드바에 차콜을 사용하여 전문적이고 신뢰감 있는 느낌
- **순백톤의 깔끔함**: 메인 배경과 카드에 순백톤을 사용하여 가독성과 시각적 편안함 제공
- **햇살톤의 따뜻함**: 호버 효과에 햇살톤을 사용하여 사용자 경험 향상

## 🎨 실무 개발 원칙

### 💼 **엔터프라이즈 개발 철학**

- **ID 생성**: DB 자동증가 방식 (UUID 대신) - 성능 최적화
- **스타일링**: SCSS 사용 (Tailwind CSS 제외) - 커스터마이징 자유도
- **백엔드**: Next.js로 구축 - 풀스택 개발 효율성
- **코드 품질**: 실무 최적화 코드 패턴 적용 - 유지보수성
- **학습 방식**: 단계별 고급 기술로 발전 - 체계적 학습

### 🔧 **실무에서 중요한 것들**

- **타입 안전성**: TypeScript로 런타임 에러 방지
- **에러 처리**: Repository Pattern에서 체계적 에러 핸들링
- **코드 구조**: 확장 가능한 모듈화된 구조
- **데이터베이스**: Prisma ORM으로 안전한 데이터 접근
- **API 응답**: 표준화된 응답 형식으로 일관성 확보

### 🏗️ **현재 구현된 실무급 패턴**

#### **Repository Pattern 예시**

```typescript
// src/repositories/todoRepository.ts
export class TodoRepository
  implements IFilterableRepository<Todo, TodoFilters>
{
  async findAll(): Promise<Todo[]> {
    return await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findByFilters(filters: TodoFilters): Promise<Todo[]> {
    // 복잡한 필터링 로직을 Repository에서 처리
  }
}
```

#### **Service Layer 예시**

```typescript
// src/services/todoService.ts
export class TodoService {
  async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    try {
      const todos = await this.todoRepository.findAll();
      return {
        success: true,
        data: todos,
        message: "Todos retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve todos: ${error}`,
      };
    }
  }
}
```

#### **타입 안전성 예시**

```typescript
// src/types/todo.ts
export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

// src/types/api.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 📝 커밋 히스토리

- `초기 커밋: Next.js 블로그 프로젝트 설정 (Prisma + MySQL)`
- `Repository Pattern 구현: TodoRepository 및 기본 인터페이스 추가`
- `Service Layer 구현: TodoService 기본 CRUD 메서드 추가`
- `서버 배포: 가비아 호스팅 환경 설정 및 SSL 인증서 적용`

# Next.js Todo App 배포 및 문제 해결 가이드

이 README는 Next.js 앱 배포 중 만난 문제(서버 시작 에러, 정적 파일 404, MIME 타입 에러, Prisma DB 연결 실패 등)와 해결법. 가비아 클라우드에서 Nginx, PM2, GitHub Actions 사용 기반으로 설명

## 1. 서버 시작 에러 (EINVAL: invalid argument fe80::d00d:f4ff:febe:556b:3000)

### 문제

- Next.js가 IPv6 주소로 바인딩하려다 실패, PM2 로그에 "Failed to start server" 에러.

### 해결법

- package.json에 start 스크립트 수정 (IPv4로 강제):
  ```
  "scripts": {
    "start": "next start -H 0.0.0.0 -p 3000"
  }
  ```
- PM2 재시작:
  ```bash
  pm2 restart blog
  ```
- IPv6 비활성화 (서버 전체):
  ```bash
  sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
  ```
- 결과: 서버 정상 시작, "Ready in 947ms" 로그 출력.

## 2. 정적 파일 404 & MIME 타입 에러

### 문제

- /\_next/static/css/... .css 파일 404, MIME 타입 'text/html'로 반환 (404 HTML 페이지 때문).

### 해결법

- Nginx 설정 수정 (/etc/nginx/conf.d/www.jseo.shop.conf 생성):
  ```
  server {
      listen 80;
      server_name www.jseo.shop;
      root /home/blog;
      location /_next/static/ {
          alias /home/blog/.next/static/;
          expires 1y;
          add_header Cache-Control "public, immutable";
          types {
              text/css css;
              application/javascript js;
              font/woff2 woff2;
          }
      }
      location / {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```
- 기본 server 블록 주석 처리 (/etc/nginx/nginx.conf):
  ```
  # server {
  #     listen 80 default_server;
  #     listen [::]:80 default_server;
  #     server_name _;
  #     root /usr/share/nginx/html;
  #     ...
  # }
  ```
- Nginx 재시작:
  ```bash
  sudo nginx -t  # 문법 확인
  sudo systemctl restart nginx
  ```
- 결과: 정적 파일 200 OK, MIME 타입 정상 (text/css 등).

## 3. Prisma DB 연결 실패 (500 Internal Server Error)

### 문제

- /api/todos 500 에러, Prisma가 "Can't reach database server at `139.150.73.107:3306`"라고 함 (공인 IP 사용).

### 해결법

- `prisma.ts` 수정 (런타임에 DATABASE_URL 동적으로 읽기):

  ```
  import { PrismaClient } from "@prisma/client";

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || "mysql://blog_user:Qmffhrm_db89@localhost:3306/blog_db",
        },
      },
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
  ```

- next.config.ts에 env 추가 (빌드 시점에 반영):
  ```
  env: {
    DOMAIN_URL: process.env.DOMAIN_URL,
    MAIN_DOMAIN: "jseo.shop",
    WWW_DOMAIN: "www.jseo.shop",
    ADMIN_DOMAIN: "portal.jseo.shop",
    DATABASE_URL: process.env.DATABASE_URL,
  },
  ```
- 캐시 지우기:
  ```bash
  rm -rf .next node_modules/.cache node_modules/@prisma/client
  npm install
  npx prisma generate
  ```
- 빌드 & 재시작:
  ```bash
  export DATABASE_URL="mysql://blog_user:Qmffhrm_db89@localhost:3306/blog_db"
  npm run build
  pm2 restart blog
  ```
- 결과: API 200 OK, Todo 데이터 출력.

## 4. GitHub Actions 자동 배포 설정

### 문제

- 배포 시 빌드 실패 (EACCES 권한 에러, .next 폴더 삭제 안 됨).

### 해결법

- deploy.yml 수정 ( .next 삭제 추가):
  ```
  script: |
    cd /home/blog
    git pull origin main
    rm -rf .next  # sudo 없이 삭제
    npm install
    npm run build
    pm2 restart blog
    echo "🚀 Deployed successfully!"
    echo "🌐 Domain: ${{ secrets.DOMAIN_URL }}"
    echo "📅 Deploy time: $(date)"
  ```
- Secrets 추가:

  - `DATABASE_URL`: "mysql://blog_user:Qmffhrm_db89@localhost:3306/blog_db"
  - `SSH_HOST`: 139.150.73.107
  - `SSH_USERNAME`: blog
  - `SSH_PRIVATE_KEY`: SSH 키 내용

- 결과: 푸시 시 자동 배포, 에러 없이 성공.

## 5. Sass @import Deprecation Warning

### 문제

- 빌드 시 Sass @import deprecated 경고.

### 해결법

- globals.scss에서 @import를 @use로 바꾸고 맨 위로 옮김:

  ```
  @use "components/home.module";
  @use "components/calendar";
  @use "components/calendar-day";
  @use "components/calendar-header";
  @use "components/todo-donut-chart";

  // 나머지 스타일
  ```

- 결과: 경고 사라짐.

## 6. 기타 팁

- **로그 확인**: pm2 logs blog --lines 100
- **DB 확인**: sudo systemctl status mysql
- **테스트**: curl http://localhost:3000/api/todos

## 🔗 링크

- **GitHub**: https://github.com/memoriz2/blog.git
- **배포**: https://jseo.shop (가비아 호스팅)
- **관리자**: https://portal.jseo.shop

## 📞 문의

ahndjds@gmail.com

---

## 🏆 실무 적용 가능성

### 💼 **취업/이직 포트폴리오**

- **실무 수준의 코드 품질**로 기술력 어필
- **엔터프라이즈 아키텍처** 경험 보여주기
- **최신 기술 스택** 활용 능력 증명

### 🚀 **실제 서비스 배포**

- **가비아 호스팅** 환경에서 실제 운영 예정
- **MySQL 데이터베이스** 연동
- **실무 수준** 코드 품질로 배포 준비 완료

### 📚 **학습 효과**

- **실무에서 사용하는 패턴** 학습
- **엔터프라이즈 개발** 경험 축적
- **풀스택 개발** 능력 향상

---

**개발자**: memoriz2  
**시작일**: 2025년 7월  
**라이선스**: MIT  
**목표**: 실무급 풀스택 개발자 성장
