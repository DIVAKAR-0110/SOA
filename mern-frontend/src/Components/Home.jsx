import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/api/users/all").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      {users.map((u) => (
        <p key={u._id}>
          {u.name} - {u.email}
        </p>
      ))}
    </div>
  );
}

export default Home;
