import Link from "next/link";
import styles from "@/styles/components/_home.module.scss";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>🚀 Blog Project</h1>
      <p>실무급 풀스택 개발 프로젝트</p>

      <div className={styles.navigation}>
        <h2>📱 사용 가능한 기능</h2>
        <div className={styles.navButtons}>
          <Link href="/todo" className={styles.navButton}>
            <span className={styles.icon}>📅</span>
            <span className={styles.text}>Calendar Todo</span>
            <span className={styles.description}>월달력 Todo 관리</span>
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <h2>🔮 구현 예정 기능</h2>
        <ul className={styles.featureList}>
          <li>✅ 데이터베이스 연결 (MySQL + Prisma)</li>
          <li>✅ Repository 패턴 구현</li>
          <li>✅ Calendar Todo (월달력)</li>
          <li>⏳ 기본 Todo 앱</li>
          <li>⏳ 블로그 시스템</li>
          <li>⏳ 포트폴리오</li>
          <li>⏳ 관리자 패널</li>
        </ul>
      </div>

      <div className={styles.status}>
        <p>배포 테스트 중...</p>
      </div>
    </div>
  );
}
