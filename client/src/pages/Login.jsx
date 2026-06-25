import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login () {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const username = data.get('username')
        const password = data.get('password');

        setError('');
        setLoading(true);
        try {
        await login(username, password);
        navigate('/envelope/new');
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };
    return  (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <span className="text-3xl">✉</span>
          <h1 className="mt-3 text-xl font-semibold text-stone-800">Create an account</h1>
          <p className="text-sm text-stone-400 mt-1">Start sending letters</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Username
            </label>
            <input
              type="username"
              name="username"
              placeholder="halleyscomet"
              autoComplete="username"
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="8+ characters"
              autoComplete="current-password"
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Loggin in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-stone-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-stone-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
    )
}