import { createPortal } from "react-dom"
import { useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function AuthModal({ open, onClose, onSuccess }) {
  const { register, login } = useAuth()
  const [isLogin, setIsLogin] = useState(false) 
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const usernameRef = useRef()
  const passwordRef = useRef()

  if (!open) return null

  async function handleSubmit() {
    setError("")
    setLoading(true)
    try {
      if (!isLogin) {
        await register(usernameRef.current.value, passwordRef.current.value)
      } else {
        await login(usernameRef.current.value, passwordRef.current.value)
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-stone-50 rounded-xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="text-center">
          <h2 className="mt-2 text-xl font-semibold text-stone-800">
            {!isLogin ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-sm text-stone-400 mt-1">Start sending postcards</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Username</label>
              <input
                ref={usernameRef}
                type="text"
                placeholder="e.g. wanderer"
                autoComplete="username"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="8+ characters"
              autoComplete={!isLogin ? "new-password" : "current-password"}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? !isLogin ? "Creating account..." : "Logging in..."
              : !isLogin ? "Create account" : "Log in"
            }
          </button>
        </div>

        <p className="text-center text-sm text-stone-400">
          {!isLogin ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError("") }}
            className="text-stone-700 font-medium hover:underline"
          >
            {!isLogin ? "Log in" : "Sign up"}
          </button>
        </p>

      </div>
    </div>,
    document.body
  )
}