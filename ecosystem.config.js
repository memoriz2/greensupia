module.exports = {
  apps: [
    {
      name: "greensupia",
      script: "npm",
      args: "start",
      cwd: "/home/greensupia",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // 프로세스 관리 설정
      max_memory_restart: "1G",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,

      // 로그 설정
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // 모니터링 설정
      watch: false,
      ignore_watch: ["node_modules", "logs", ".git", ".next"],

      // 환경변수 파일
      env_file: ".env",

      // 헬스체크
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,

      // 자동 재시작 조건
      autorestart: true,
      kill_timeout: 5000,
      listen_timeout: 3000,

      // 메모리 및 CPU 제한
      node_args: "--max-old-space-size=1024",

      // PM2 메타데이터
      pmx: true,
      source_map_support: true,
    },
  ],

  // 모니터링 설정
  pm2: {
    // PM2 자체 모니터링
    monitoring: true,

    // 로그 설정
    log: {
      date: true,
      timestamp: true,
    },

    // 메트릭 수집
    metrics: {
      enabled: true,
      interval: 5000,
    },
  },
};
