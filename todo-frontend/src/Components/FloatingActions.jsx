// src/components/FloatingActions.jsx
export default function FloatingActions() {
  return (
    <>
      <button
        className="fab fab-chat"
        onClick={() => alert("Open chat assistant")}
      >
        💬
      </button>

      <button
        className="fab fab-emergency"
        onClick={() => alert("Emergency call popup")}
      >
        ⚠
      </button>
    </>
  );
}
