import Link from "next/link";

export default function TodoPage() {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>📝 Todo App</h1>
      <p>Todo 기능은 아직 구현 중입니다...</p>
      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            padding: "0.5rem 1rem",
            border: "1px solid #0070f3",
            borderRadius: "4px",
          }}
        >
          ← 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
