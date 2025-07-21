export default function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🚀 Blog Project</h1>
      <p>실무급 풀스택 개발 프로젝트</p>
      <div style={{ marginTop: "2rem" }}>
        <h2>구현 예정 기능</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>✅ 데이터베이스 연결 (MySQL + Prisma)</li>
          <li>✅ Repository 패턴 구현</li>
          <li>⏳ Todo 앱</li>
          <li>🔮 블로그 시스템</li>
          <li>🔮 포트폴리오</li>
          <li>🔮 관리자 패널</li>
        </ul>
      </div>
      <div style={{ marginTop: "2rem", color: "#666" }}>
        <p>배포 테스트 중...</p>
      </div>
    </div>
  );
}
