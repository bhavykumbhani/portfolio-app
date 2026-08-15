'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.ok) {
      router.replace('/admin');
    } else {
      setError(result?.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100 dark:bg-zinc-950 font-mono">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center space-x-1.5 text-zinc-800 dark:text-zinc-200">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <span className="font-bold">bhavy-console.sh</span>
          </div>
          <span className="text-[10px] text-zinc-400">auth_gate_v1.0</span>
        </div>
        {/* Body */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 flex items-start space-x-2">
              <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="username" className="text-zinc-500 dark:text-zinc-400">USERNAME</label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-55/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-zinc-500 dark:text-zinc-400">PASSWORD</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-55/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {isLoading ? 'ESTABLISHING CONNECTION...' : 'RUN AUTHENTICATION'}
          </button>

          <div className="pt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal border-t border-zinc-100 dark:border-zinc-800">
            Default credentials for local dev:<br />
            Username: <span className="font-semibold text-zinc-700 dark:text-zinc-300">admin</span> •
            Password: <span className="font-semibold text-zinc-700 dark:text-zinc-300">admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
}
