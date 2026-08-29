import { useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SigninForm({ error, isLoading, message, onSubmit, onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Email address
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">
          Password
        </span>
        <span className="flex border-b border-neutral-300 transition focus-within:border-neutral-950">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="px-2 text-neutral-400 transition hover:text-neutral-950"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
      </label>

      <div className="flex items-center justify-between gap-4 text-xs">
        <label className="flex cursor-pointer items-center gap-2 text-neutral-600">
          <input type="checkbox" className="accent-neutral-950" /> Remember me
        </label>
        <button type="button" className="border-b border-neutral-400 pb-0.5 transition hover:border-neutral-950">
          Forgot password?
        </button>
      </div>

      {error && <p role="alert" className="border-l-2 border-red-500 pl-3 text-xs leading-5 text-red-700">{error}</p>}
      {message && <p role="status" className="border-l-2 border-emerald-600 pl-3 text-xs leading-5 text-emerald-700">{message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="group flex w-full items-center justify-between bg-neutral-950 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign in"}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>

      <p className="pt-2 text-center text-xs text-neutral-500">
        New to BSCENTS?{" "}
        <button type="button" onClick={onSwitch} className="font-medium text-neutral-950 underline underline-offset-4">
          Create an account
        </button>
      </p>
    </form>
  );
}
