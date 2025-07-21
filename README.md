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

### 📈 **확장성 및 유지보수성**

- **모듈화된 타입 시스템** (types 폴더)
- **재사용 가능한 Repository** 패턴
- **일관된 코딩 컨벤션** (TypeScript)

### 🚀 **성능 최적화**

- **Next.js App Router** 사용
- **Prisma** 효율적인 데이터베이스 쿼리
- **모듈화된 구조**로 번들 크기 최적화

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
- 기본 파일 구조 생성
- GitHub 저장소 설정

### 🔄 진행 중

- ⏳ Repository Pattern 구현
- ⏳ Service Layer 구현
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

## 📝 커밋 히스토리

- `초기 커밋: Next.js 블로그 프로젝트 설정 (Prisma + MySQL)`

## 🔗 링크

- **GitHub**: https://github.com/memoriz2/blog.git
- **배포 예정**: 가비아 호스팅

## 📞 문의

프로젝트 관련 문의사항이 있으시면 GitHub Issues를 이용해주세요.

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
