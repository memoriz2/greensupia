# 🚀 Prisma 문제 해결 가이드

## ❌ 자주 발생하는 Prisma 문제들

### 1. "Prisma Client did not initialize yet"

```bash
# 해결 방법
npm run db:generate    # 클라이언트 생성
npm run db:push        # 스키마 동기화
```

### 2. "Environment variable not found: DATABASE_URL"

```bash
# 해결 방법
# .env 파일에 DATABASE_URL 추가
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 3. "Connection failed" 또는 "Connection timeout"

```bash
# 해결 방법
# 1. MySQL 서버 실행 확인
# 2. DATABASE_URL 형식 확인
# 3. 방화벽/포트 설정 확인
```

## 🔧 자동화된 해결 방법

### 한 번에 모든 문제 해결

```bash
# Windows PowerShell (권장)
npm run db:setup          # 기본 설정
npm run db:setup:clean    # 캐시 클리어 후 설정
npm run db:setup:reset    # 완전 초기화 (node_modules 재설치)
npm run db:fix            # 빠른 수정 (캐시 클리어 + 빌드 스킵)

# Linux/Mac (Bash)
npm run db:setup:bash         # 기본 설정
npm run db:setup:bash:clean   # 캐시 클리어 후 설정
npm run db:setup:bash:reset   # 완전 초기화
```

### 수동으로 단계별 해결

```bash
# 1. 환경변수 확인
echo $env:DATABASE_URL

# 2. Prisma 클라이언트 생성
npm run db:generate

# 3. 데이터베이스 연결 테스트
npx prisma db pull

# 4. 스키마 동기화
npm run db:push

# 5. 시드 데이터 생성
npm run db:seed
```

## 📋 문제 해결 체크리스트

### ✅ 환경변수

- [ ] `.env` 파일 존재
- [ ] `DATABASE_URL` 설정됨
- [ ] MySQL 연결 문자열 형식 올바름

### ✅ 데이터베이스

- [ ] MySQL 서버 실행 중
- [ ] 데이터베이스 존재
- [ ] 사용자 권한 확인
- [ ] 포트 3306 접근 가능

### ✅ Prisma

- [ ] `npx prisma generate` 실행됨
- [ ] `npx prisma db push` 성공
- [ ] `node_modules/.prisma` 폴더 존재

### ✅ 애플리케이션

- [ ] 서버 재시작
- [ ] 캐시 클리어
- [ ] TypeScript 컴파일 성공

## 🚨 긴급 상황 해결

### 모든 것을 리셋하고 다시 시작

```bash
# 🚀 자동화된 해결 (권장)
npm run db:setup:reset    # PowerShell - 완전 초기화
npm run db:setup:bash:reset  # Bash - 완전 초기화

# 🔧 수동 해결
# 1. Prisma 캐시 클리어
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# 2. 의존성 재설치
npm install

# 3. Prisma 재설정
npm run db:setup
```

### 데이터베이스 완전 초기화

```bash
# ⚠️ 주의: 모든 데이터 삭제됨
npm run db:reset
```

## 🔍 디버깅 도구

### Prisma Studio 실행

```bash
npm run db:studio
```

### 연결 상태 확인

```bash
npx prisma db pull
```

### 스키마 검증

```bash
npx prisma validate
```

## 📞 문제가 지속될 때

1. **로그 확인**: `npm run dev` 실행 시 콘솔 출력 확인
2. **환경변수 확인**: `.env.local` 파일 내용 확인
3. **MySQL 연결 테스트**: 다른 도구로 데이터베이스 연결 확인
4. **Prisma 버전 확인**: `npx prisma --version`

## 🎯 예방 방법

### 개발 시작 시

```bash
npm run db:setup
```

### 코드 변경 후

```bash
npm run db:generate
npm run db:push
```

### 배포 전

```bash
npm run db:deploy
npm run build
```

---

**💡 팁**: `npm run db:setup` 명령어 하나로 모든 Prisma 문제를 해결할 수 있습니다!
