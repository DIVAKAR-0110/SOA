import { useEffect, useState } from "react";
import { validateApiKey } from "../api/LocationApi";

export default function ApiStatus({ onValid }) {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    validateApiKey().then((result) => {
      if (result.valid) {
        setStatus("valid");
        onValid(true);
      } else {
        setStatus("invalid");
        setMessage(result.reason);
        onValid(false);
      }
    });
  }, [onValid]);

  if (status === "checking") return <p>Checking API access…</p>;
  if (status === "invalid")
    return (
      <div style={{ color: "red" }}>
        <h3>API Access Denied</h3>
        <p>{message}</p>
      </div>
    );
  return null;
}
