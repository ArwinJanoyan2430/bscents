import { useEffect, useState } from "react";

const sizes = {
  xs: "h-4 w-4",
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const variants = {
  default: "text-neutral-900",
  light: "text-neutral-400",
  white: "text-white",
  gold: "text-amber-500",
};

// ======================================================
// SPINNER
// ======================================================

function Spinner({ size = "md", variant = "default", className = "" }) {
  return (
    <div
      className={`
        relative
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      {/* Background circle */}
      <div
        className="
          absolute
          inset-0
          rounded-full
          border-2
          border-current
          opacity-10
        "
      />

      {/* Outer spinner */}
      <div
        className="
          absolute
          inset-0
          animate-spin
          rounded-full
          border-2
          border-transparent
          border-t-current
          border-r-current
        "
        style={{
          animationDuration: "900ms",
        }}
      />

      {/* Inner spinner */}
      <div
        className="
          absolute
          inset-[22%]
          animate-spin
          rounded-full
          border-2
          border-transparent
          border-b-current
          opacity-40
        "
        style={{
          animationDuration: "1.4s",
          animationDirection: "reverse",
        }}
      />

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ======================================================
// FULL SCREEN LOADER
// ======================================================

export default function Loader({
  isLoading = true,
  className = "",
  size = "lg",
  variant = "default",
  message = "Crafting your essence...",
}) {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (!showLoader) return null;

  return (
    <div
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-white/95
        backdrop-blur-sm
        transition-opacity
        duration-300

        ${isLoading ? "opacity-100" : "pointer-events-none opacity-0"}

        ${className}
      `}
      aria-busy={isLoading}
    >
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <Spinner size={size} variant={variant} />

        {/* Brand */}
        <div className="mt-8 text-center">
          <h1
            className="
              text-sm
              font-semibold
              tracking-[0.4em]
              text-neutral-900
            "
          >
            BSCENTS
          </h1>

          <p
            className="
              mt-3
              text-xs
              font-light
              tracking-wider
              text-neutral-500
            "
          >
            {message}
          </p>
        </div>

        {/* Loading dots */}
        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="
                h-1.5
                w-1.5
                animate-bounce
                rounded-full
                bg-neutral-900
              "
              style={{
                animationDelay: `${dot * 150}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// INLINE LOADER
// ======================================================

export function InlineLoader({
  size = "sm",
  variant = "default",
  className = "",
}) {
  return <Spinner size={size} variant={variant} className={className} />;
}

// ======================================================
// PAGE TRANSITION LOADER
// ======================================================

export function PageTransitionLoader({ children, isLoading }) {
  return (
    <div className="relative min-h-screen">
      <Loader
        isLoading={isLoading}
        size="lg"
        variant="default"
        message="Loading your experience..."
      />

      <div
        className={`
          transition-all
          duration-500
          ease-out

          ${
            isLoading
              ? "pointer-events-none translate-y-2 opacity-0"
              : "opacity-100"
          }
        `}
      >
        {children}
      </div>
    </div>
  );
}
