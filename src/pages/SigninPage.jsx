import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import yslImage from "../assets/home-images/ysl.png";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function SigninPage() {
  const [mode, setMode] = useState("signin");
  const [status, setStatus] = useState({ error: "", loading: false, message: "" });
  const navigate = useNavigate();
  const isSignin = mode === "signin";

  const requireSupabase = () => {
    if (isSupabaseConfigured) return true;
    setStatus({
      error: "Supabase is not configured yet. Add your project URL and publishable key to .env, then restart the app.",
      loading: false,
      message: "",
    });
    return false;
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setStatus({ error: "", loading: false, message: "" });
  };

  const handleSignin = async (event) => {
    event.preventDefault();
    if (!requireSupabase()) return;

    const formData = new FormData(event.currentTarget);
    setStatus({ error: "", loading: true, message: "" });
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email").trim(),
      password: formData.get("password"),
    });

    if (error) {
      setStatus({ error: error.message, loading: false, message: "" });
      return;
    }

    toast.success(data.user?.app_metadata?.role === "admin" ? "Welcome, Admin" : "Signed in successfully");
    navigate("/");
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!requireSupabase()) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    setStatus({ error: "", loading: true, message: "" });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, full_name: `${firstName} ${lastName}`.trim() },
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    });

    if (error) {
      setStatus({ error: error.message, loading: false, message: "" });
      return;
    }

    if (data.session) {
      toast.success("Account created successfully");
      navigate("/");
      return;
    }

    form.reset();
    setStatus({ error: "", loading: false, message: "Check your inbox to confirm your BSCENTS account." });
    toast.success("Account created. Please confirm your email.");
  };

  const handleGoogleSignin = async () => {
    if (!requireSupabase()) return;
    setStatus({ error: "", loading: true, message: "" });
    sessionStorage.setItem("bscents-google-login-pending", "true");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      sessionStorage.removeItem("bscents-google-login-pending");
      setStatus({ error: error.message, loading: false, message: "" });
    }
  };

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#f7f6f2] text-neutral-950 lg:min-h-[calc(100svh-5rem)]">
      <div className="grid min-h-[inherit] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img src={yslImage} alt="YSL fragrance" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">The BSCENTS community</p>
            <h1 className="mt-5 max-w-xl font-serif text-6xl font-light leading-[0.95]">
              Your signature scent, <span className="italic text-white/65">remembered.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm font-light leading-7 text-white/70">
              Save favorites, revisit your orders, and discover fragrances selected for you.
            </p>
          </div>
        </section>

        <section className={`flex items-center justify-center px-5 sm:px-8 lg:px-14 xl:px-20 ${isSignin ? "py-16" : "py-8 lg:py-10"}`}>
          <div className="w-full max-w-md">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">My BSCENTS</p>
            <h2 className="mt-4 font-serif text-5xl font-light tracking-tight sm:text-6xl">
              {isSignin ? "Welcome back." : "Join BSCENTS."}
            </h2>
            <p className={`${isSignin ? "mb-10" : "mb-6"} mt-4 text-sm font-light leading-6 text-neutral-500`}>
              {isSignin
                ? "Sign in to access your account and saved fragrances."
                : "Create an account for a more personal fragrance experience."}
            </p>

            <div className={`${isSignin ? "mb-9" : "mb-6"} grid grid-cols-2 border-b border-neutral-300`} role="tablist" aria-label="Account form">
              {[
                ["signin", "Sign in"],
                ["signup", "Create account"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => changeMode(value)}
                  className={`border-b-2 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition ${
                    mode === value ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignin}
              disabled={status.loading}
              className="flex w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] transition hover:border-neutral-950 disabled:cursor-wait disabled:opacity-60"
            >
              <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full border border-neutral-300 font-semibold normal-case tracking-normal">G</span>
              Continue with Google
            </button>

            <div className={`${isSignin ? "my-7" : "my-5"} flex items-center gap-4 text-[9px] uppercase tracking-[0.22em] text-neutral-400`}>
              <span className="h-px flex-1 bg-neutral-300" /> or continue with email <span className="h-px flex-1 bg-neutral-300" />
            </div>

            {isSignin ? (
              <SigninForm {...status} isLoading={status.loading} onSubmit={handleSignin} onSwitch={() => changeMode("signup")} />
            ) : (
              <SignupForm {...status} isLoading={status.loading} onSubmit={handleSignup} onSwitch={() => changeMode("signin")} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
