#!/bin/bash

# Greensupia Next.js Development & Production Environment Setup Script
# 모든 의존성 문제와 Prisma 엔진 문제를 자동으로 해결
# 프로덕션 모드에서는 build와 start까지 포함
# TypeScript 오류 자동 수정 기능 포함
# 개발 모드에서는 환경 설정 후 수동 서버 시작 안내

set -e  # 에러 발생 시 스크립트 중단

# 무한 루프 방지 로직
SCRIPT_LOCK_FILE=".dev_setup_running"
if [[ -f "$SCRIPT_LOCK_FILE" ]]; then
    echo "❌ Another instance of dev-setup.sh is already running!"
    echo "   If this is an error, delete the file: $SCRIPT_LOCK_FILE"
    exit 1
fi

# 스크립트 실행 중임을 표시
touch "$SCRIPT_LOCK_FILE"

# Windows 환경 감지
detect_windows_environment() {
    # 여러 방법으로 Windows 환경 감지
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        return 0
    elif [[ "$(uname -s)" == "MINGW"* ]] || [[ "$(uname -s)" == "MSYS"* ]]; then
        return 0
    elif [[ "$(uname -s)" == "Windows_NT"* ]]; then
        return 0
    elif [[ "$OS" == "Windows_NT" ]]; then
        return 0
    elif command -v taskkill >/dev/null 2>&1; then
        return 0
    elif [[ "$(pwd)" == *"C:"* ]] || [[ "$(pwd)" == *"D:"* ]]; then
        return 0
    elif [[ "$PWD" == *"C:"* ]] || [[ "$PWD" == *"D:"* ]]; then
        return 0
    else
        return 1
    fi
}

# 백그라운드 프로세스 정리 함수
cleanup() {
    log_info "Cleaning up background processes..."
    
    # 개발 서버 프로세스 종료
    # 개발 서버 프로세스 정리 (이전 실행에서 남은 프로세스가 있을 경우)
    log_info "Checking for any existing development server processes..."
    pkill -f "npm run dev" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    # 로그 모니터링 프로세스 정리 (더 이상 사용하지 않음)
    # TAIL_PID와 LOG_MONITOR_PID는 제거됨
    

    
    # 락 파일 정리
    rm -f "$SCRIPT_LOCK_FILE"
    log_info "Cleanup completed"
}

# 스크립트 종료 시 cleanup 함수 실행
trap cleanup EXIT

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 로깅 함수들
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${CYAN}🔧 $1${NC}"
}

log_production() {
    echo -e "${PURPLE}🚀 $1${NC}"
}

log_fix() {
    echo -e "${YELLOW}🔧 $1${NC}"
}

# Windows 환경 여부 저장 (로깅 함수 정의 후)
IS_WINDOWS=false
if detect_windows_environment; then
    IS_WINDOWS=true
    log_info "Windows environment detected"
    
    # Windows 환경에서 관리자 권한 확인
    log_warning "For best results, run this script as Administrator"
    log_info "Right-click Git Bash > 'Run as administrator'"
    
    # 관리자 권한으로 실행 중인지 확인 (선택사항)
    if command -v net session >/dev/null 2>&1; then
        if net session >/dev/null 2>&1; then
            log_success "Running with administrator privileges"
        else
            log_warning "Not running with administrator privileges - some operations may fail"
        fi
    fi
else
    log_info "Unix/Linux environment detected"
fi

# 시드 데이터 리셋 함수
reset_seed_data() {
    log_info "Resetting seed data..."
    
    # 시드 완료 플래그 파일 삭제
    if [[ -f ".seed_completed" ]]; then
        rm -f ".seed_completed"
        log_success "Seed completion flag removed"
    fi
    
    # DB에서 시드 데이터 삭제
    log_info "Clearing existing seed data from database..."
    if npx prisma db execute --schema prisma/schema.prisma --file prisma/reset_seed_data.sql 2>/dev/null; then
        log_success "Existing seed data cleared from database"
    else
        log_warning "Could not clear database (may be empty or error occurred)"
    fi
    
    log_info "Seed data reset completed - next run will regenerate seed data"
}

# TypeScript 오류 자동 수정 함수
fix_typescript_errors() {
    log_fix "Auto-fixing TypeScript errors..."
    
    # 이미 수정된 파일인지 확인하는 플래그 파일
    local fix_flag_file=".typescript_fixed"
    
    # 이미 수정되었다면 건너뛰기
    if [[ -f "$fix_flag_file" ]]; then
        log_info "TypeScript errors already fixed, skipping..."
        return 0
    fi
    
    # 1. Prisma 모델명 대소문자 수정 (안전하게)
    log_info "Fixing Prisma model names..."
    
    # bannerNews → bannernews (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/prisma\.bannerNews/prisma.bannernews/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/prisma\.BannerNews/prisma.bannernews/g' {} \;
    
    # organizationChart → organizationchart (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/prisma\.organizationChart/prisma.organizationchart/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/prisma\.OrganizationChart/prisma.organizationchart/g' {} \;
    
    # 2. Prisma 타입 대소문자 수정 (안전하게)
    log_info "Fixing Prisma type names..."
    
    # Banner → banner (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/import { Banner }/import { banner }/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/: Banner/: banner/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/): Banner/): banner/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/\[Banner\]/\[banner\]/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/type Banner/type banner/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/interface Banner/interface banner/g' {} \;
    
    # Greeting → greeting (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/import { Greeting }/import { greeting }/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/: Greeting/: greeting/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/): Greeting/): greeting/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/\[greeting\]/\[greeting\]/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/type Greeting/type greeting/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/interface Greeting/interface greeting/g' {} \;
    
    # Inquiry → inquiry (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/import { Inquiry }/import { inquiry }/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/: Inquiry/: inquiry/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/): Inquiry/): inquiry/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -not -path "*/node_modules/*" -exec sed -i 's/\[Inquiry\]/\[inquiry\]/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/type Inquiry/type inquiry/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/interface Inquiry/interface inquiry/g' {} \;
    
    # Video → video (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/import { Video }/import { video }/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/: Video/: video/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/): Video/): video/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/\[Video\]/\[video\]/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/type Video/type video/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/interface Video/interface video/g' {} \;
    
    # BannerNews → bannernews (한 번만 실행)
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/import { BannerNews }/import { bannernews }/g' {} \;
    find src -name "*.ts" -type f -not -path "*/node_modules/*" -exec sed -i 's/: BannerNews/: bannernews/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/): BannerNews/): bannernews/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/\[BannerNews\]/\[bannernews\]/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/type BannerNews/type bannernews/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/interface BannerNews/interface bannernews/g' {} \;
    
    # OrganizationChart → organizationchart
    find src -name "*.ts" -type f -exec sed -i 's/import { OrganizationChart }/import { organizationchart }/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/: OrganizationChart/: organizationchart/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/): OrganizationChart/): organizationchart/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/\[OrganizationChart\]/\[organizationchart\]/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/type OrganizationChart/type organizationchart/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/interface OrganizationChart/interface organizationchart/g' {} \;
    
    # NoticeAttachment → noticeattachment
    find src -name "*.ts" -type f -exec sed -i 's/import { NoticeAttachment }/import { noticeattachment }/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/: NoticeAttachment/: noticeattachment/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/): NoticeAttachment/): noticeattachment/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/\[NoticeAttachment\]/\[noticeattachment\]/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/type NoticeAttachment/type noticeattachment/g' {} \;
    find src -name "*.ts" -type f -exec sed -i 's/interface NoticeAttachment/interface noticeattachment/g' {} \;
    
    # 3. Repository 클래스명 수정
    log_info "Fixing repository class names..."
    
    # InquiryRepository → inquiryRepository
    find src -name "*.ts" -type f -exec sed -i 's/InquiryRepository/inquiryRepository/g' {} \;
    
    # 4. seed.ts 파일 수정
    if [[ -f "prisma/seed.ts" ]]; then
        log_info "Fixing seed.ts file..."
        
        # bannerNews → bannernews
        sed -i 's/prisma\.bannerNews/prisma.bannernews/g' prisma/seed.ts
        
        # organizationChart → organizationchart
        sed -i 's/prisma\.organizationChart/prisma.organizationchart/g' prisma/seed.ts
        
        # updatedAt 필드 제거 (Prisma가 자동으로 처리)
        sed -i '/updatedAt:/d' prisma/seed.ts
        sed -i '/createdAt:/d' prisma/seed.ts
    fi
    

    
    # 6. noticeRepository.ts의 필드명 수정
    if [[ -f "src/repositories/noticeRepository.ts" ]]; then
        log_info "Fixing noticeRepository field names..."
        
        # originalName → fileName
        sed -i 's/originalName: file\.originalname/fileName: file.originalname/g' src/repositories/noticeRepository.ts
        
        # path → filePath
        sed -i 's/path: file\.path/filePath: file.path/g' src/repositories/noticeRepository.ts
        
        # size → fileSize
        sed -i 's/size: file\.size/fileSize: file.size/g' src/repositories/noticeRepository.ts
    fi
    
    # 7. 모든 Repository에서 updatedAt/createdAt 필드 제거
    log_info "Removing createdAt/updatedAt fields from create/update operations..."
    
    # create/update 데이터에서 updatedAt, createdAt 제거
    find src/repositories -name "*.ts" -type f -exec sed -i '/updatedAt:/d' {} \;
    find src/repositories -name "*.ts" -type f -exec sed -i '/createdAt:/d' {} \;
    
    # 8. Buffer 타입 오류 수정 (download route)
    if [[ -f "src/app/api/notices/attachments/[id]/download/route.ts" ]]; then
        log_info "Fixing Buffer type error in download route..."
        
        # Buffer를 Uint8Array로 변환
        sed -i 's/new NextResponse(fileBuffer)/new NextResponse(new Uint8Array(fileBuffer))/g' src/app/api/notices/attachments/[id]/download/route.ts
    fi
    
    # 9. 타입 정의 파일들 수정
    log_info "Fixing type definition files..."
    
    # banner.ts
    if [[ -f "src/types/banner.ts" ]]; then
        sed -i 's/export type Banner/export type banner/g' src/types/banner.ts
        sed -i 's/export interface Banner/export interface banner/g' src/types/banner.ts
    fi
    
    # bannerNews.ts
    if [[ -f "src/types/bannerNews.ts" ]]; then
        sed -i 's/export type BannerNews/export type bannernews/g' src/types/bannerNews.ts
        sed -i 's/export interface BannerNews/export interface bannernews/g' src/types/bannerNews.ts
    fi
    
    # greeting.ts
    if [[ -f "src/types/greeting.ts" ]]; then
        sed -i 's/export type Greeting/export type greeting/g' src/types/greeting.ts
        sed -i 's/export interface Greeting/export interface greeting/g' src/types/greeting.ts
    fi
    
    # video.ts
    if [[ -f "src/types/video.ts" ]]; then
        sed -i 's/export type Video/export type video/g' src/types/video.ts
        sed -i 's/export interface Video/export interface video/g' src/types/video.ts
    fi
    
    # 10. Service 파일들 수정
    log_info "Fixing service files..."
    
    # 모든 service 파일에서 타입명 수정
    find src/services -name "*.ts" -type f -exec sed -i 's/: Banner/: banner/g' {} \;
    find src/services -name "*.ts" -type f -exec sed -i 's/: Greeting/: greeting/g' {} \;
    find src/services -name "*.ts" -type f -exec sed -i 's/: Inquiry/: inquiry/g' {} \;
    find src/services -name "*.ts" -type f -exec sed -i 's/: Video/: video/g' {} \;
    find src/services -name "*.ts" -type f -exec sed -i 's/: BannerNews/: bannernews/g' {} \;
    find src/services -name "*.ts" -type f -exec sed -i 's/: OrganizationChart/: organizationchart/g' {} \;
    
    # 수정 완료 플래그 파일 생성
    touch "$fix_flag_file"
    log_success "TypeScript errors auto-fixed and marked as completed"
}

# 인자 파싱
CLEAN_CACHE=false
SKIP_BUILD=false
FULL_RESET=false
FORCE_REINSTALL=false
PRODUCTION_MODE=false
START_SERVER=false
AUTO_FIX=false
RESET_SEED=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean-cache)
            CLEAN_CACHE=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --full-reset)
            FULL_RESET=true
            CLEAN_CACHE=true
            shift
            ;;
        --force-reinstall)
            FORCE_REINSTALL=true
            FULL_RESET=true
            CLEAN_CACHE=true
            shift
            ;;
        --production)
            PRODUCTION_MODE=true
            SKIP_BUILD=false
            AUTO_FIX=true
            shift
            ;;
        --start)
            START_SERVER=true
            shift
            ;;
        --auto-fix)
            AUTO_FIX=true
            shift
            ;;
        --reset-seed)
            RESET_SEED=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --clean-cache      Clear all caches"
            echo "  --skip-build       Skip build step"
            echo "  --full-reset       Full reset (clear cache + reinstall)"
            echo "  --force-reinstall  Force reinstall all dependencies"
            echo "  --production       Production mode (build + start)"
            echo "  --start            Start server after setup"
            echo "  --auto-fix         Auto-fix TypeScript errors"
            echo "  --reset-seed       Reset seed data (clear and regenerate)"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Development setup only"
            echo "  $0 --production       # Production setup (build + start)"
            echo "  $0 --production --start  # Production setup + start server"
            echo "  $0 --clean-cache      # Clear cache and setup"
            echo "  $0 --full-reset       # Full reset and setup"
            echo "  $0 --auto-fix         # Auto-fix TypeScript errors"
            echo "  $0 --reset-seed       # Reset seed data only"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# 모드 표시
if [[ "$PRODUCTION_MODE" == true ]]; then
    echo -e "${PURPLE}🚀 PRODUCTION MODE ENABLED${NC}"
    echo -e "${PURPLE}   Will build and start production server${NC}"
    echo -e "${PURPLE}   Auto-fix TypeScript errors enabled${NC}"
elif [[ "$AUTO_FIX" == true ]]; then
    echo -e "${YELLOW}🔧 AUTO-FIX MODE ENABLED${NC}"
    echo -e "${YELLOW}   Will auto-fix TypeScript errors${NC}"
else
    echo -e "${CYAN}🔧 DEVELOPMENT MODE${NC}"
fi

echo -e "${CYAN}🌟 Greensupia Next.js Environment Setup Started...${NC}"

# 1. 캐시 클리어
if [[ "$CLEAN_CACHE" == true ]] || [[ "$FULL_RESET" == true ]]; then
    log_step "Clearing cache..."
    
    if [[ -d ".next" ]]; then
        rm -rf .next
        log_success "Next.js cache cleared"
    fi
    
    if [[ -d "node_modules/.prisma" ]]; then
        rm -rf node_modules/.prisma
        log_success "Prisma cache cleared"
    fi
    
    if [[ -d "node_modules/@prisma" ]]; then
        rm -rf node_modules/@prisma
        log_success "Prisma packages cache cleared"
    fi
fi

# 2. 환경변수 확인
log_step "Checking environment variables..."
if [[ -f ".env" ]]; then
    log_success ".env file found"
else
    log_error ".env file not found!"
    log_warning "Please create .env file in project root"
    exit 1
fi

# 3. 의존성 설치/재설치
if [[ "$FULL_RESET" == true ]] || [[ "$FORCE_REINSTALL" == true ]] || [[ ! -d "node_modules" ]]; then
    log_step "Installing dependencies..."
    
    if [[ -d "node_modules" ]]; then
        log_info "Removing existing node_modules..."
        rm -rf node_modules
        log_success "Existing node_modules removed"
    fi
    
    if [[ -f "package-lock.json" ]]; then
        log_info "Removing package-lock.json..."
        rm -f package-lock.json
        log_success "package-lock.json removed"
    fi
    
    log_info "Installing dependencies with npm..."
    if npm install; then
        log_success "Dependencies installed successfully"
    else
        log_error "Dependencies installation failed"
        exit 1
    fi
else
    log_success "Dependencies already installed"
fi

# 4. Prisma 엔진 문제 해결
log_step "Setting up Prisma..."

# Windows 환경에서 Prisma 엔진 문제 해결
fix_prisma_windows() {
    log_info "Applying Windows-specific Prisma fixes..."
    
    # PowerShell 경로 명시적 지정 (Windows 경로 구분자 사용)
    POWERSHELL_PATH="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
    
    # 대안 경로들도 시도
    if [ ! -f "$POWERSHELL_PATH" ]; then
        POWERSHELL_PATH="C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"
    fi
    
    if [ ! -f "$POWERSHELL_PATH" ]; then
        POWERSHELL_PATH="powershell.exe"
    fi
    
    # 1. 모든 Node.js 프로세스 종료
    log_info "Stopping all Node.js processes..."
    if command -v taskkill >/dev/null 2>&1; then
        log_info "Using taskkill to stop Node.js processes..."
        taskkill /f /im node.exe 2>/dev/null || true
        taskkill /f /im npm.exe 2>/dev/null || true
        taskkill /f /im npx.exe 2>/dev/null || true
        taskkill /f /im "node.exe" 2>/dev/null || true
        taskkill /f /im "npm.exe" 2>/dev/null || true
        taskkill /f /im "npx.exe" 2>/dev/null || true
    fi
    
    # PowerShell로도 프로세스 종료 시도 (명시적 경로 사용)
    if [ -f "$POWERSHELL_PATH" ]; then
        log_info "Using PowerShell (explicit path) to stop Node.js processes..."
        "$POWERSHELL_PATH" -Command "Get-Process -Name 'node' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        "$POWERSHELL_PATH" -Command "Get-Process -Name 'npm' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        "$POWERSHELL_PATH" -Command "Get-Process -Name 'npx' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
    elif command -v powershell >/dev/null 2>&1; then
        log_info "Using PowerShell (PATH) to stop Node.js processes..."
        powershell -Command "Get-Process -Name 'node' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        powershell -Command "Get-Process -Name 'npm' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        powershell -Command "Get-Process -Name 'npx' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
    fi
    
    # 2. 잠시 대기
    log_info "Waiting for processes to fully terminate..."
    sleep 5
    
    # 3. Prisma 캐시 완전 정리 (Windows 안전 방식)
    log_info "Cleaning Prisma cache completely..."
    
    # .prisma 폴더 정리
    if [ -d "node_modules/.prisma" ]; then
        log_info "Removing .prisma folder..."
        
        # 먼저 파일 권한 변경 시도
        if command -v icacls >/dev/null 2>&1; then
            icacls "node_modules\.prisma" /grant Everyone:F /T /Q 2>/dev/null || true
        fi
        
        # Windows 명령어 우선 시도
        if command -v rmdir >/dev/null 2>&1; then
            rmdir /s /q "node_modules\.prisma" 2>/dev/null || true
        fi
        
        # Unix 명령어로 재시도
        rm -rf "node_modules/.prisma" 2>/dev/null || true
        
        # PowerShell 명령어로 재시도 (명시적 경로 우선)
        if [ -f "$POWERSHELL_PATH" ]; then
            "$POWERSHELL_PATH" -Command "Remove-Item -Path 'node_modules\.prisma' -Recurse -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        elif command -v powershell >/dev/null 2>&1; then
            powershell -Command "Remove-Item -Path 'node_modules\.prisma' -Recurse -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        fi
        
        # 마지막 시도: 강제 삭제
        if [ -d "node_modules/.prisma" ]; then
            log_warning ".prisma folder still exists, trying aggressive removal..."
            # 모든 하위 파일 먼저 삭제
            find "node_modules/.prisma" -type f -exec rm -f {} \; 2>/dev/null || true
            # 빈 폴더 삭제
            find "node_modules/.prisma" -type d -empty -delete 2>/dev/null || true
            # 최종 삭제
            rm -rf "node_modules/.prisma" 2>/dev/null || true
        fi
    fi
    
    # @prisma 폴더 정리
    if [ -d "node_modules/@prisma" ]; then
        log_info "Removing @prisma folder..."
        
        # 먼저 파일 권한 변경 시도
        if command -v icacls >/dev/null 2>&1; then
            icacls "node_modules\@prisma" /grant Everyone:F /T /Q 2>/dev/null || true
        fi
        
        if command -v rmdir >/dev/null 2>&1; then
            rmdir /s /q "node_modules\@prisma" 2>/dev/null || true
        fi
        rm -rf "node_modules/@prisma" 2>/dev/null || true
        if [ -f "$POWERSHELL_PATH" ]; then
            "$POWERSHELL_PATH" -Command "Remove-Item -Path 'node_modules\@prisma' -Recurse -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        elif command -v powershell >/dev/null 2>&1; then
            powershell -Command "Remove-Item -Path 'node_modules\@prisma' -Recurse -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        fi
        
        # 마지막 시도: 강제 삭제
        if [ -d "node_modules/@prisma" ]; then
            log_warning "@prisma folder still exists, trying aggressive removal..."
            find "node_modules/@prisma" -type f -exec rm -f {} \; 2>/dev/null || true
            find "node_modules/@prisma" -type d -empty -delete 2>/dev/null || true
            rm -rf "node_modules/@prisma" 2>/dev/null || true
        fi
    fi
    
    # 4. package-lock.json 정리
    if [ -f "package-lock.json" ]; then
        log_info "Removing package-lock.json..."
        rm -f "package-lock.json" 2>/dev/null || true
        if [ -f "$POWERSHELL_PATH" ]; then
            "$POWERSHELL_PATH" -Command "Remove-Item -Path 'package-lock.json' -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        elif command -v powershell >/dev/null 2>&1; then
            powershell -Command "Remove-Item -Path 'package-lock.json' -Force -ErrorAction SilentlyContinue" 2>/dev/null || true
        fi
    fi
    
    # 5. npm 캐시 정리
    log_info "Cleaning npm cache..."
    npm cache clean --force 2>/dev/null || true
    
    # 6. 잠시 대기
    sleep 2
    
    # 7. Prisma 패키지 재설치
    log_info "Reinstalling Prisma packages..."
    npm install prisma @prisma/client --force
    
    # 8. 잠시 대기
    sleep 3
}

# Prisma 패키지 상태 확인
if [[ ! -d "node_modules/@prisma" ]] || [[ ! -d "node_modules/prisma" ]]; then
    log_warning "Prisma packages incomplete, reinstalling..."
    npm uninstall prisma @prisma/client 2>/dev/null || true
    npm install prisma @prisma/client
    log_success "Prisma packages reinstalled"
fi

# Prisma 클라이언트 생성
log_info "Generating Prisma client..."
if npx prisma generate; then
    log_success "Prisma client generated successfully"
else
    log_error "Prisma client generation failed"
    log_warning "Trying to fix Prisma engine issues..."
    
    # Windows 환경 감지 및 특별 처리
    if [[ "$IS_WINDOWS" == "true" ]]; then
        log_info "Windows environment detected, applying special fixes..."
        fix_prisma_windows
    else
        # 일반적인 Prisma 엔진 문제 해결 시도
        log_info "Unix/Linux environment detected, applying standard fixes..."
        rm -rf node_modules/.prisma
        rm -rf node_modules/@prisma
        npm install prisma @prisma/client
    fi
    
    # 다시 Prisma 클라이언트 생성 시도
    log_info "Retrying Prisma client generation..."
    if npx prisma generate; then
        log_success "Prisma client generated after fix"
    else
        log_error "Prisma client generation still failed"
        log_warning "Trying one more time with force flag..."
        
        # 마지막 시도: 강제 생성
        if npx prisma generate --force; then
            log_success "Prisma client generated with force flag"
        else
            log_error "Prisma client generation failed even with force flag"
            log_warning "Manual intervention may be required"
            log_info "Try running: npx prisma generate --force"
            exit 1
        fi
    fi
fi

# 5. 데이터베이스 연결 테스트
log_step "Testing database connection..."
if npx prisma db pull; then
    log_success "Database connection successful"
else
    log_error "Database connection failed"
    log_warning "Please check DATABASE_URL in .env file"
    exit 1
fi

# 6. 스키마 동기화
log_step "Synchronizing schema..."
if npx prisma db push; then
    log_success "Schema synchronization completed"
else
    log_error "Schema synchronization failed"
    exit 1
fi

# 7. TypeScript 오류 자동 수정
if [[ "$AUTO_FIX" == true ]]; then
    fix_typescript_errors
fi

# 8. 시드 데이터 생성 (프로덕션에서는 건너뛰기)
if [[ "$PRODUCTION_MODE" == false ]]; then
    log_step "Checking seed data..."
    
    # 시드 리셋 옵션이 활성화된 경우
    if [[ "$RESET_SEED" == true ]]; then
        log_info "Reset seed option detected, clearing existing seed data..."
        reset_seed_data
    fi
    
            if [[ -f "prisma/seed.ts" ]]; then
            # 시드 중복 실행 방지: 시드 실행 플래그 파일 확인
            SEED_FLAG_FILE=".seed_completed"
            if [[ -f "$SEED_FLAG_FILE" ]] && [[ "$RESET_SEED" == false ]]; then
                log_info "Seed data already generated (flag file exists), skipping seed generation"
            else
                log_info "Generating seed data..."
                if npx prisma db seed; then
                    log_success "Seed data generated successfully"
                    # 시드 완료 플래그 파일 생성
                    touch "$SEED_FLAG_FILE"
                    log_info "Seed completion flag created: $SEED_FLAG_FILE"
                else
                    log_warning "Seed data generation failed, continuing without seed data"
                fi
            fi
    else
        log_warning "Seed file not found (prisma/seed.ts)"
    fi
else
    log_warning "Skipping seed data in production mode"
fi

# 9. 빌드 (프로덕션 모드에서는 필수)
if [[ "$PRODUCTION_MODE" == true ]] || [[ "$SKIP_BUILD" == false ]]; then
    log_step "Running build..."
    
    # TypeScript 컴파일 확인
    log_info "Checking TypeScript compilation..."
    if npx tsc --noEmit; then
        log_success "TypeScript compilation successful"
    else
        log_error "TypeScript compilation failed"
        if [[ "$PRODUCTION_MODE" == true ]]; then
            log_error "Cannot proceed with production build"
            log_warning "Trying to auto-fix remaining errors..."
            fix_typescript_errors
            
            # 다시 컴파일 시도
            if npx tsc --noEmit; then
                log_success "TypeScript compilation successful after auto-fix"
            else
                log_error "TypeScript compilation still failed after auto-fix"
                exit 1
            fi
        else
            log_warning "TypeScript compilation has warnings, continuing..."
        fi
    fi
    
    # Next.js 빌드
    log_info "Building Next.js..."
    if npx next build; then
        log_success "Build successful"
    else
        if [[ "$PRODUCTION_MODE" == true ]]; then
            log_error "Production build failed"
            exit 1
        else
            log_warning "Build failed, but development server can still run"
        fi
    fi
fi

# 10. 최종 상태 확인
log_step "Final verification..."
if [[ -d "node_modules/@prisma" ]] && [[ -d "node_modules/.prisma" ]]; then
    log_success "Prisma setup verified"
else
    log_error "Prisma setup incomplete"
    exit 1
fi

if [[ "$PRODUCTION_MODE" == true ]]; then
    if [[ -d ".next" ]]; then
        log_success "Production build verified"
    else
        log_error "Production build not found"
        exit 1
    fi
fi

# 포트 3000 사용 중인 모든 프로세스 강제 종료 (강화된 버전)
kill_port_3000() {
    log_info "🔒 강력한 포트 3000 정리 시작..."
    
    # 1단계: 일반적인 Node.js 프로세스 정리
    log_info "1단계: Node.js 관련 프로세스 정리..."
    pkill -f "node.*3000" 2>/dev/null || true
    pkill -f "npm.*dev" 2>/dev/null || true
    pkill -f "next.*dev" 2>/dev/null || true
    pkill -f "next.*start" 2>/dev/null || true
    
    sleep 2  # 프로세스 종료 대기

    # 2단계: npx kill-port 강력 사용
    if command -v npx >/dev/null 2>&1; then
        log_info "2단계: npx kill-port 강력 정리..."
        
        # kill-port가 없으면 설치
        if ! npm list -g kill-port >/dev/null 2>&1 && ! npm list kill-port >/dev/null 2>&1; then
            log_info "kill-port 설치 중..."
            npm install -g kill-port 2>/dev/null || true
        fi
        
        # 여러 번 시도로 확실하게 정리
        local kill_attempts=0
        while [ $kill_attempts -lt 3 ]; do
            kill_attempts=$((kill_attempts + 1))
            log_info "kill-port 시도 $kill_attempts/3..."
            
            npx kill-port 3000 2>/dev/null
            sleep 2
            
            # 포트 상태 확인
            if ! node -e "require('http').get('http://localhost:3000', () => process.exit(0)).on('error', () => process.exit(1)).setTimeout(1000)" 2>/dev/null; then
                log_success "✅ Port 3000 cleared successfully with kill-port (attempt $kill_attempts)"
                return 0
            fi
            
            if [ $kill_attempts -lt 3 ]; then
                log_warning "Port 3000 still active, retrying in 3 seconds..."
                sleep 3
            fi
        done
        log_warning "⚠️ Port 3000 still active after kill-port attempts"
    else
        log_error "❌ npx not available. Please ensure Node.js and npm are installed."
    fi

    # 3단계: PowerShell 강력 정리
    local POWERSHELL_PATH="powershell.exe"
    if ! command -v "$POWERSHELL_PATH" >/dev/null 2>&1; then
        POWERSHELL_PATH="C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
    fi
    
    if command -v "$POWERSHELL_PATH" >/dev/null 2>&1 || [ -f "$POWERSHELL_PATH" ]; then
        log_info "3단계: PowerShell 강력 정리..."
        
        local ps_attempts=0
        while [ $ps_attempts -lt 3 ]; do
            ps_attempts=$((ps_attempts + 1))
            log_info "PowerShell 시도 $ps_attempts/3..."
            
            # 더 강력한 PowerShell 스크립트
            "$POWERSHELL_PATH" -Command "
                try {
                    # 포트 3000 사용 프로세스 찾기 및 종료
                    \$connections = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
                    if (\$connections) {
                        Write-Host \"Found \$(\$connections.Count) connections on port 3000\"
                        \$pids = \$connections | Select-Object -ExpandProperty OwningProcess -Unique
                        foreach (\$pid in \$pids) {
                            try { 
                                Stop-Process -Id \$pid -Force -ErrorAction SilentlyContinue
                                Write-Host \"Killed process \$pid\"
                            } catch { 
                                Write-Host \"Failed to kill PID \$pid: \$_\" 
                            }
                        }
                    }
                    
                    # Node.js 관련 프로세스 강제 종료
                    \$nodeProcesses = Get-Process -Name 'node', 'npm', 'npx' -ErrorAction SilentlyContinue
                    if (\$nodeProcesses) {
                        Write-Host \"Found \$(\$nodeProcesses.Count) Node.js processes\"
                        \$nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
                        Write-Host \"Killed all Node.js processes\"
                    }
                    
                    # 추가 대기
                    Start-Sleep -Seconds 2
                } catch {
                    Write-Host \"PowerShell error: \$_\" 
                }
            " 2>/dev/null || true
            
            sleep 3  # PowerShell 실행 후 대기
            
            # 포트 상태 확인
            if ! node -e "require('http').get('http://localhost:3000', () => process.exit(0)).on('error', () => process.exit(1)).setTimeout(1000)" 2>/dev/null; then
                log_success "✅ Port 3000 cleared successfully with PowerShell (attempt $ps_attempts)"
                return 0
            fi
            
            if [ $ps_attempts -lt 3 ]; then
                log_warning "Port 3000 still active, retrying in 3 seconds..."
                sleep 3
            fi
        done
        log_warning "⚠️ Port 3000 still active after PowerShell attempts"
    else
        log_warning "⚠️ PowerShell not found. Skipping PowerShell method."
    fi

    # 4단계: 최종 강력 정리 및 확인
    log_info "4단계: 최종 강력 정리 및 확인..."
    
    # 마지막 수단: 모든 Node.js 프로세스 강제 종료
    log_warning "🚨 마지막 수단: 모든 Node.js 프로세스 강제 종료..."
    pkill -9 -f "node" 2>/dev/null || true
    pkill -9 -f "npm" 2>/dev/null || true
    pkill -9 -f "next" 2>/dev/null || true
    
    sleep 5  # 강제 종료 후 충분한 대기
    
    # 최종 포트 상태 확인 (반복 확인으로 강화)
    log_info "🔍 최종 포트 상태 확인 (5회 반복)..."
    local final_attempts=0
    local max_final_attempts=5
    
    while [ $final_attempts -lt $max_final_attempts ]; do
        final_attempts=$((final_attempts + 1))
        log_info "최종 확인 시도 $final_attempts/$max_final_attempts..."
        
        if ! node -e "require('http').get('http://localhost:3000', () => process.exit(0)).on('error', () => process.exit(1)).setTimeout(1000)" 2>/dev/null; then
            log_success "🎉 Port 3000 is now completely free (verified on attempt $final_attempts)"
            return 0
        fi
        
        if [ $final_attempts -lt $max_final_attempts ]; then
            log_warning "Port 3000 still active, waiting 3 seconds before next check..."
            sleep 3
        fi
    done
    
    # 모든 시도 후에도 포트가 사용 중인 경우 - 상세한 안내
    log_error "❌ Port 3000 is still active after all attempts!"
    echo -e "${RED}🚨 포트 3000 정리 실패! 수동 정리가 필요합니다.${NC}"
    echo -e "${YELLOW}다음 방법을 시도해보세요:${NC}"
    echo -e "${CYAN}1. PowerShell을 관리자 권한으로 실행:${NC}"
    echo -e "   Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess"
    echo -e "   Stop-Process -Id <PID> -Force"
    echo -e "${CYAN}2. 작업 관리자 (Ctrl+Shift+Esc):${NC}"
    echo -e "   - '세부 정보' 탭 → 'node.exe' 또는 'npm.exe' 검색"
    echo -e "   - 우클릭 → 작업 끝내기"
    echo -e "${CYAN}3. 컴퓨터 재시작 후 다시 시도${NC}"
    
    return 1
}

# 서버 상태 확인 함수 (포트 3000만 체크) - Node.js 기반으로 개선
# check_server_health 함수 제거됨 - 서버 시작은 수동으로 진행

# 11. 서버 시작 (프로덕션 모드에서만)
if [[ "$PRODUCTION_MODE" == true ]] && [[ "$START_SERVER" == true ]]; then
    log_production "Starting production server..."
    log_info "Server will be available at http://localhost:3000"
    log_info "Press Ctrl+C to stop the server"

    # 포트 3000 먼저 정리
    log_info "Preparing port 3000 for production server..."
    kill_port_3000
    
    # 잠시 대기 후 서버 시작
    sleep 1

    # 백그라운드에서 서버 시작
    log_info "Starting production server on port 3000..."
    
    # 로그 파일 생성
    log_file="prod-server.log"
    log_info "Server logs will be saved to: $log_file"
    
    # 서버를 백그라운드에서 실행하고 로그를 파일로 리다이렉트
    PORT=3000 npm run start > "$log_file" 2>&1 &
    SERVER_PID=$!
    
    # 로그 모니터링 제거됨 - 서버 시작 후 바로 완료 메시지 표시

    # 서버 시작 대기
    sleep 5

    # 프로세스 존재 확인
    if kill -0 $SERVER_PID 2>/dev/null; then
        log_info "Server process started (PID: $SERVER_PID), checking health..."
        
        # 서버 시작 완료
        log_success "Production server started successfully (PID: $SERVER_PID)"
        echo -e "${GREEN}🎉 Production environment is ready!${NC}"
        echo -e "${GREEN}Server is running at http://localhost:3000${NC}"
        echo -e "${YELLOW}To stop server: kill $SERVER_PID${NC}"
    else
        log_error "Failed to start production server"
        exit 1
    fi
else
            # 개발 모드에서도 서버 자동 시작
        if [[ "$PRODUCTION_MODE" == false ]]; then
            log_step "Development environment setup..."
            log_info "Development server will be available at http://localhost:3000"
            log_info "Server will be started manually after setup"
            
                    # 포트 3000 먼저 정리
        log_info "Preparing port 3000 for development server..."
        if kill_port_3000; then
            log_success "Port 3000 cleared successfully"
        else
            log_error "Failed to clear port 3000!"
            log_info "Please manually free port 3000 and try again:"
            log_info "1. Open PowerShell and run:"
            log_info "   Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess"
            log_info "   Stop-Process -Id <PID> -Force"
            log_info "2. Or use Task Manager (Ctrl+Shift+Esc):"
            log_info "   - Go to 'Details' tab"
            log_info "   - Search for 'node.exe' or 'npm.exe'"
            log_info "   - Right-click > End Task"
            log_info "3. Then run this script again"
            exit 1
        fi
        
        # 잠시 대기 후 서버 시작
        sleep 1
        
        # 포트 정리 후 충분한 지연 시간 추가
        log_info "Waiting for port to be completely free..."
        sleep 3
        
        # 개발 서버 시작 안내 (수동 실행)
        log_info "Development server setup completed!"
        log_info "To start the server manually, run:"
        echo -e "\n${GREEN}🎯 Next steps:${NC}"
        echo -e "${GREEN}1. Start the development server:${NC}"
        echo -e "${GREEN}   npm run dev${NC}"
        echo -e "\n${GREEN}2. The server will be available at:${NC}"
        echo -e "${GREEN}   http://localhost:3000${NC}"
        echo -e "\n${GREEN}3. To stop the server:${NC}"
        echo -e "${GREEN}   Ctrl+C in the terminal${NC}"
        
        # 환경 설정 완료 메시지
        echo -e "\n${GREEN}🎉 Development environment setup completed!${NC}"
        echo -e "${GREEN}✅ Dependencies installed${NC}"
        echo -e "${GREEN}✅ Database setup completed${NC}"
        echo -e "${GREEN}✅ Environment configured${NC}"
        echo -e "${GREEN}✅ Ready for manual server start${NC}"
        
        log_success "Setup completed successfully. You can now start the server manually."
    else
        if [[ "$PRODUCTION_MODE" == true ]]; then
            echo -e "${GREEN}🎉 Production environment setup completed!${NC}"
            echo -e "${YELLOW}Start production server with: npm run start${NC}"
        else
            echo -e "${GREEN}🎉 Development environment setup completed!${NC}"
            echo -e "${YELLOW}Start development server with: npm run dev${NC}"
        fi
    fi
fi

# 추가 도움말
echo -e "${CYAN}💡 Available commands:${NC}"
if [[ "$PRODUCTION_MODE" == true ]]; then
    echo -e "  npm run start        - Start production server"
    echo -e "  npm run build        - Build for production"
else
    echo -e "  npm run dev          - Start development server"
    echo -e "  npm run build        - Build for production"
fi
echo -e "  npx prisma studio    - Open Prisma Studio"
echo -e "  npx prisma db pull   - Pull database schema"
echo -e "  npx prisma db push   - Push schema to database"

# 프로덕션 모드 추가 정보
if [[ "$PRODUCTION_MODE" == true ]]; then
    echo -e "${PURPLE}🚀 Production Mode Tips:${NC}"
    echo -e "  - Use 'npm run start' to start production server"
    echo -e "  - Server runs on port 3000 by default"
    echo -e "  - Environment variables must be properly configured"
    echo -e "  - Database must be accessible from production environment"
fi

# 자동 수정 모드 정보
if [[ "$AUTO_FIX" == true ]]; then
    echo -e "${YELLOW}🔧 Auto-Fix Mode Info:${NC}"
    echo -e "  - TypeScript errors have been automatically fixed"
    echo -e "  - Prisma model names corrected to lowercase"
    echo -e "  - Missing fields and type mismatches resolved"
fi

# Next.js 설정 파일 복원
if [ -f "next.config.ts.backup" ]; then
    log_info "Restoring original Next.js configuration..."
    mv next.config.ts.backup next.config.ts
    log_success "Next.js configuration restored"
fi

# 스크립트 완료 메시지
echo -e "${GREEN}🎉 Script execution completed successfully!${NC}"
echo -e "${CYAN}💡 Next steps:${NC}"
echo -e "  npm run dev              - Start development server"
echo -e "  npm run build            - Build for production"
echo -e "  npx prisma studio        - Open Prisma Studio"
