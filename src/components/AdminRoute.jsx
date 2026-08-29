import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const [access, setAccess] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) setAccess("signed-out");
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data.user) {
        setAccess("signed-out");
        return;
      }

      setAccess(data.user.app_metadata?.role === "admin" ? "admin" : "denied");
    };

    verifyAdmin();
    return () => {
      isMounted = false;
    };
  }, []);

  if (access === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f6f2]">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500">
          Verifying admin access
        </p>
      </main>
    );
  }

  if (access === "signed-out") {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (access === "denied") {
    return <Navigate to="/" replace />;
  }

  return children;
}
