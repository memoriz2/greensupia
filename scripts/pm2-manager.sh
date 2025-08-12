#!/bin/bash

# ========================================
# PM2 프로세스 관리 스크립트 (간단 버전)
# Greensupia Next.js용
# ========================================

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 도움말 출력
show_help() {
    echo "PM2 프로세스 관리 스크립트 (간단 버전)"
    echo ""
    echo "사용법: $0 [옵션]"
    echo ""
    echo "옵션:"
    echo "  --start     - 애플리케이션 시작"
    echo "  --stop      - 애플리케이션 중지"
    echo "  --restart   - 애플리케이션 재시작"
    echo "  --status    - 상태 확인"
    echo "  --logs      - 로그 확인"
    echo "  --setup     - 초기 설정"
    echo "  --help      - 도움말 출력"
    echo ""
    echo "예시:"
    echo "  $0 --start"
    echo "  $0 --status"
    echo "  $0 --logs"
}

# PM2 설치 확인
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2가 설치되지 않았습니다."
        log_info "설치 중..."
        npm install -g pm2
        if [ $? -eq 0 ]; then
            log_success "PM2 설치 완료"
        else
            log_error "PM2 설치 실패"
            exit 1
        fi
    fi
}

# 애플리케이션 시작
start_app() {
    log_info "애플리케이션을 시작합니다..."
    
    # PM2로 애플리케이션 시작
    if pm2 start ecosystem.config.js --env production; then
        log_success "애플리케이션이 성공적으로 시작되었습니다"
        pm2 save
        log_success "PM2 설정이 저장되었습니다"
    else
        log_error "애플리케이션 시작 실패"
        exit 1
    fi
}

# 애플리케이션 중지
stop_app() {
    log_info "애플리케이션을 중지합니다..."
    
    if pm2 stop greensupia; then
        log_success "애플리케이션이 중지되었습니다"
    else
        log_warning "애플리케이션이 이미 중지되었거나 존재하지 않습니다"
    fi
}

# 애플리케이션 재시작
restart_app() {
    log_info "애플리케이션을 재시작합니다..."
    
    if pm2 restart greensupia; then
        log_success "애플리케이션이 재시작되었습니다"
    else
        log_error "애플리케이션 재시작 실패"
        exit 1
    fi
}

# 상태 확인
show_status() {
    log_info "애플리케이션 상태를 확인합니다..."
    echo ""
    pm2 status
    echo ""
}

# 로그 확인
show_logs() {
    log_info "최근 50줄의 로그를 확인합니다..."
    pm2 logs greensupia --lines 50
}

# 초기 설정
setup_app() {
    log_info "PM2 초기 설정을 시작합니다..."
    
    # PM2 설치 확인
    check_pm2
    
    # 로그 디렉토리 생성
    mkdir -p logs
    log_info "로그 디렉토리 생성 완료"
    
    # PM2 설정 파일 확인
    if [ ! -f "ecosystem.config.js" ]; then
        log_error "ecosystem.config.js 파일이 없습니다"
        exit 1
    fi
    
    # PM2 시작
    start_app
    
    # PM2 자동 시작 설정
    pm2 startup
    log_success "PM2 자동 시작 설정 완료"
    
    log_success "PM2 초기 설정이 완료되었습니다"
}

# 메인 로직
case "${1:---help}" in
    --start)
        check_pm2
        start_app
        ;;
    --stop)
        check_pm2
        stop_app
        ;;
    --restart)
        check_pm2
        restart_app
        ;;
    --status)
        check_pm2
        show_status
        ;;
    --logs)
        check_pm2
        show_logs
        ;;
    --setup)
        setup_app
        ;;
    --help|*)
        show_help
        ;;
esac
