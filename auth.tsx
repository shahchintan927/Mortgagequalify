"use client";

// DEMO AUTH LAYER
// -----------------------------------------------------------------------
// This is a fully functional front-end demo of accounts, sessions and an
// admin role, persisted in the browser via localStorage. It is NOT secure
// and stores nothing server-side — passwords are not hashed and anyone
// with devtools access can inspect this data. It exists so the product
// flow (signup -> login -> save calculators -> admin views users) works
// end-to-end today. Swap this file for real auth (e.g. NextAuth.js,
// Supabase Auth, or Clerk) plus a real database before going to production.
// -----------------------------------------------------------------------

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — never store plaintext passwords in production
  role: "user" | "admin";
  createdAt: string;
}

export interface SavedCalculation {
  id: string;
  userId: string;
  type: string;
  label: string;
  inputSummary: string;
  resultSummary: string;
  createdAt: string;
  payload?: string; // optional JSON blob for calculators that support later review (e.g. multi-scenario comparisons)
}

const USERS_KEY = "mv_users";
const SESSION_KEY = "mv_session";
const CALCS_KEY = "mv_saved_calcs";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedIfEmpty() {
  const users = readJSON<DemoUser[]>(USERS_KEY, []);
  if (users.length === 0) {
    const seeded: DemoUser[] = [
      {
        id: "admin-1",
        name: "Site Admin",
        email: "admin@mortgageverse.ca",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "user-1",
        name: "Jordan Lee",
        email: "jordan@example.com",
        password: "password123",
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ];
    writeJSON(USERS_KEY, seeded);
  }
}

interface AuthContextValue {
  user: DemoUser | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  allUsers: () => DemoUser[];
  savedCalculations: (userId?: string) => SavedCalculation[];
  saveCalculation: (calc: Omit<SavedCalculation, "id" | "createdAt" | "userId">) => void;
  deleteCalculation: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    const sessionId = readJSON<string | null>(SESSION_KEY, null);
    if (sessionId) {
      const found = readJSON<DemoUser[]>(USERS_KEY, []).find((u) => u.id === sessionId);
      setUser(found ?? null);
    }
    setLoading(false);
  }, []);

  const login: AuthContextValue["login"] = (email, password) => {
    const users = readJSON<DemoUser[]>(USERS_KEY, []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Incorrect email or password." };
    writeJSON(SESSION_KEY, found.id);
    setUser(found);
    return { ok: true };
  };

  const signup: AuthContextValue["signup"] = (name, email, password) => {
    const users = readJSON<DemoUser[]>(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const newUser: DemoUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    writeJSON(USERS_KEY, [...users, newUser]);
    writeJSON(SESSION_KEY, newUser.id);
    setUser(newUser);
    return { ok: true };
  };

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const allUsers = () => readJSON<DemoUser[]>(USERS_KEY, []);

  const savedCalculations: AuthContextValue["savedCalculations"] = (userId) => {
    const all = readJSON<SavedCalculation[]>(CALCS_KEY, []);
    return userId ? all.filter((c) => c.userId === userId) : all;
  };

  const saveCalculation: AuthContextValue["saveCalculation"] = (calc) => {
    if (!user) return;
    const all = readJSON<SavedCalculation[]>(CALCS_KEY, []);
    const record: SavedCalculation = {
      ...calc,
      id: `calc-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    writeJSON(CALCS_KEY, [record, ...all]);
  };

  const deleteCalculation = (id: string) => {
    const all = readJSON<SavedCalculation[]>(CALCS_KEY, []);
    writeJSON(CALCS_KEY, all.filter((c) => c.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        allUsers,
        savedCalculations,
        saveCalculation,
        deleteCalculation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
