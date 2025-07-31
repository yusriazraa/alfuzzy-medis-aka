// frontend/src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple role-based login simulation
    if (
      username === "admin" ||
      username === "santri" ||
      username === "orangtua"
    ) {
      login(username);
      router.push("/dashboard");
    } else {
      alert("Username tidak valid. Coba: admin, santri, atau orangtua");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Gunakan 'admin', 'santri', atau 'orangtua'"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            // className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
