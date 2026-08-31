import React, { useState } from "react";

export default function App({ users }) {
  const [email, setEmail] = useState("");
  return (
    <main className="page-shell">
      <h1>Account directory</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </form>
      <ul>
        {users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </main>
  );
}
