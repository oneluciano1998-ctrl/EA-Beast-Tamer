export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050b1f",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>👑 Beast Tamer Dashboard</h1>

      <p>Welcome CEO</p>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #00bfff",
          borderRadius: "15px",
        }}
      >
        <h2>System Status</h2>

        <p>Database: Online ✅</p>
        <p>API: Online ✅</p>
        <p>License Server: Online ✅</p>
      </div>
    </main>
  );
}