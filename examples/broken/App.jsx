import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function App() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setCount(count + 1);
  }, [count]);

  console.log("users", users);

  function mutateUsers(user) {
    users.push(user); setUsers(users);
  }

  return (
    <main className="w-screen min-h-screen bg-gradient-to-r from-violet-600 to-blue-600">
      <h1 className="bg-clip-text text-transparent">Future Platform</h1>
      <img src="/hero.png" />
      <input type="email" />
      <input type="password" name="password" />
      <div onClick={() => mutateUsers({ id: 4 })}>Add user</div>
      {users.map((user) => (
        <article key={Math.random()} className="backdrop-blur-xl bg-white/10 rounded-[17px] z-[9999]">
          <button className="p-1"><Trash2 /></button>
          {user.name}
        </article>
      ))}
    </main>
  );
}
