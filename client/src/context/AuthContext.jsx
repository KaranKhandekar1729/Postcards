import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetch(`${API_URL}/api/auth/me`, {
            credentials: 'include',
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data?.data ?? null))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json()
        if (!res.ok) throw new Error(data.message);
        setUser(data.data);
    }

    const register =  async (username, password) => {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await res.json()
        if (!res.ok) throw new Error(data.message);
        setUser(data.data);
    }

    const logout = async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)