import { useEffect, useRef, useState } from "react";
import bsLogo from "../assets/bsLogo.png";
import { User, ShoppingBag, Menu, X, ArrowUpRight, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const navLinks = [
  { id: "home", href: "/", label: "Home" },
  { id: "shop", href: "/shop", label: "Shop" },
  { id: "about", href: "/#about", label: "About" },
  { id: "contact", href: "/#contact", label: "Contact" },
];

export default function NavBar({ cartCount = 0, onCartOpen }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const accountDropdownRef = useRef(null);
  const isAdmin = user?.app_metadata?.role === "admin";

  const customerName = (() => {
    if (!user) return "Account";
    const metadata = user.user_metadata ?? {};
    if (metadata.first_name || metadata.last_name) {
      return [metadata.first_name, metadata.last_name].filter(Boolean).join(" ");
    }
    if (metadata.given_name || metadata.family_name) {
      return [metadata.given_name, metadata.family_name].filter(Boolean).join(" ");
    }
    const parts = (metadata.full_name || metadata.name || "").trim().split(/\s+/).filter(Boolean);
    return parts.length > 1 ? `${parts[0]} ${parts.at(-1)}` : parts[0] || "Account";
  })();

  const isLinkActive = (link) => {
    if (link.href.startsWith("/#")) {
      return pathname === "/" && hash === link.href.slice(1);
    }

    if (link.href === "/") {
      return pathname === "/" && !hash;
    }

    return pathname === link.href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAccountOpen) return undefined;

    const closeAccountMenu = (event) => {
      if (accountDropdownRef.current?.contains(event.target)) return;
      if (event.target.closest('[data-account-trigger="true"]')) return;
      setIsAccountOpen(false);
    };

    document.addEventListener("pointerdown", closeAccountMenu);
    return () => document.removeEventListener("pointerdown", closeAccountMenu);
  }, [isAccountOpen]);

  const handleAccountClick = () => {
    if (!user) {
      navigate("/signin");
      return;
    }
    setIsAccountOpen((open) => !open);
  };

  const handleLogout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Unable to log out. Please try again.");
        return;
      }
    }
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`
          sticky top-0 z-50 w-full
          border-b transition-all duration-500

          ${
            scrolled || isMenuOpen
              ? "border-neutral-200/80 bg-white/95 shadow-[0_10px_40px_rgba(23,23,23,0.06)] backdrop-blur-xl"
              : "border-transparent bg-[#f8f7f3]/90 backdrop-blur-lg"
          }
        `}
      >
        <nav
          className="
            relative
            mx-auto
            flex h-[68px]
            max-w-7xl
            items-center
            justify-between
            px-4
            sm:px-8
            lg:h-20
            lg:px-10
          "
          aria-label="Main navigation"
        >
          {/* ================= LOGO ================= */}

          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-4"
            aria-label="BSCENTS Home"
          >
            <img
              src={bsLogo}
              alt="BSCENTS"
              className="
                h-9 w-9
                object-contain
                transition-transform
                duration-500
                group-hover:rotate-[-5deg]
                group-hover:scale-105
                xl:h-10 xl:w-10
              "
            />

            <div className="">
              <p
                className="
                  font-serif
                  text-lg
                  font-light
                  tracking-[0.3em]
                  text-neutral-950
                  xl:text-xl
                "
              >
                BSCENTS
              </p>

              <p
                className="
                  mt-0.5
                  text-[7px]
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                "
              >
                Fragrance Store
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}

          <div
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              xl:flex
            "
          >
            <ul className="flex items-center gap-0.5 rounded-full border border-neutral-200 bg-white/80 p-1 shadow-[0_6px_24px_rgba(23,23,23,0.04)]">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    aria-current={isLinkActive(link) ? "page" : undefined}
                    className={`
                      group
                      relative
                      flex
                      h-9
                      items-center
                      rounded-full
                      px-4
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-neutral-600
                      transition-colors
                      duration-300
                      outline-none
                      focus-visible:ring-2
                      focus-visible:ring-neutral-950
                      focus-visible:ring-offset-2
                      hover:bg-neutral-100 hover:text-neutral-950
                      ${isLinkActive(link) ? "bg-neutral-950 text-white hover:bg-neutral-950 hover:text-white" : ""}
                    `}
                  >
                    {link.label}

                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ================= DESKTOP ACTIONS ================= */}

          <div className="hidden items-center gap-2 xl:flex">
            <button type="button" data-account-trigger="true" onClick={handleAccountClick} aria-expanded={user ? isAccountOpen : undefined} aria-haspopup={user ? "menu" : undefined} className="flex h-10 max-w-52 items-center gap-2 rounded-full px-4 text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-600 outline-none transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2">
              <User size={16} strokeWidth={1.5} /> <span className="truncate">{customerName}</span>
              {user && <ChevronDown size={13} className={`shrink-0 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />}
            </button>
            <button type="button" onClick={onCartOpen} className="relative flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-5 text-[9px] font-medium uppercase tracking-[0.14em] text-white outline-none transition hover:bg-[#9a7a42] focus-visible:ring-2 focus-visible:ring-[#9a7a42] focus-visible:ring-offset-2">
              <ShoppingBag size={16} strokeWidth={1.5} /> Cart
              {cartCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[9px] text-neutral-950">{cartCount}</span>}
            </button>
          </div>

          {/* ================= MOBILE ACTIONS ================= */}

          <div className="flex items-center gap-0.5 sm:gap-1 xl:hidden">
            <div data-account-trigger="true">
              <ActionButton
                icon={User}
                label={customerName}
                onClick={handleAccountClick}
              />
            </div>

            <ActionButton icon={ShoppingBag} label="Cart" count={cartCount} onClick={onCartOpen} />

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="
                ml-0.5
                flex h-10 w-10
                items-center
                justify-center
                rounded-full
                border
                border-neutral-200/80
                bg-white/70
                text-neutral-800
                backdrop-blur-md
                transition-all
                duration-300
                hover:bg-neutral-950
                hover:text-white
                active:scale-90
                outline-none
                focus-visible:ring-2
                focus-visible:ring-neutral-950
                focus-visible:ring-offset-2
              "
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-[18px] w-[18px]" />
              ) : (
                <Menu className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          {user && isAccountOpen && (
            <div ref={accountDropdownRef} role="menu" className="absolute right-4 top-[calc(100%-2px)] z-50 w-64 border border-neutral-200 bg-white p-2 shadow-[0_20px_60px_rgba(23,23,23,0.14)] sm:right-8 lg:right-10">
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="truncate font-serif text-lg font-light text-neutral-950">{customerName}</p>
                <p className="mt-1 truncate text-[10px] text-neutral-400">{user.email}</p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsAccountOpen(false);
                    navigate("/admin");
                  }}
                  className="mt-1 flex w-full items-center justify-between px-4 py-3 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:bg-neutral-100 focus-visible:outline-none"
                >
                  Admin dashboard <LayoutDashboard size={15} strokeWidth={1.5} />
                </button>
              )}
              <button type="button" role="menuitem" onClick={handleLogout} className="mt-1 flex w-full items-center justify-between px-4 py-3 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600 transition hover:bg-neutral-950 hover:text-white focus-visible:bg-neutral-950 focus-visible:text-white focus-visible:outline-none">
                Log out <LogOut size={15} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`
          fixed inset-0 z-40
          overflow-y-auto overscroll-contain
          transition-opacity duration-300
          xl:hidden

          ${
            isMenuOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0 delay-300"
          }
        `}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
        />
        <div
          className={`
            relative ml-auto
            flex min-h-[100svh]
            w-[min(90%,430px)]
            flex-col
            bg-[#f8f7f3]
            px-4
            pb-6
            pt-20
            shadow-[-20px_0_60px_rgba(23,23,23,0.12)]
            transition-transform duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            min-[360px]:px-6
            sm:px-8
            sm:pb-8
            lg:pt-24
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* Mobile Links */}

          <div className="flex-1">
            <p
              className="
                mb-4
                text-[9px]
                font-medium
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              Navigation
            </p>

            <nav>
              <ul className="border-t border-neutral-200">
                {navLinks.map((link, index) => (
                  <li key={link.id} className="border-b border-neutral-200">
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isLinkActive(link) ? "page" : undefined}
                      className={`
                        group
                        flex
                        items-center
                        justify-between
                        py-4
                        sm:py-5
                        outline-none
                        focus-visible:bg-white
                        focus-visible:ring-2
                        focus-visible:ring-inset
                        focus-visible:ring-neutral-950
                        ${isLinkActive(link) ? "bg-white/60 px-4" : ""}
                      `}
                    >
                      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                        <span
                          className="
                            text-[9px]
                            tracking-[0.2em]
                            text-neutral-400
                          "
                        >
                          0{index + 1}
                        </span>

                        <span
                          className={`
                            font-serif
                            text-3xl
                            font-light
                            tracking-tight
                            text-neutral-950
                            transition-transform
                            duration-300
                            group-hover:translate-x-2
                            min-[360px]:text-4xl
                            sm:text-5xl
                            ${isLinkActive(link) ? "italic" : ""}
                          `}
                        >
                          {link.label}
                        </span>
                      </div>

                      <ArrowUpRight
                        className="
                          h-5 w-5
                          text-neutral-400
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:-translate-y-1
                          group-hover:text-neutral-950
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile quick actions */}

          <div className="mt-8 sm:mt-10">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    handleLogout();
                  } else {
                    setIsMenuOpen(false);
                    navigate("/signin");
                  }
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-neutral-300
                  px-3 py-3
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  duration-300
                  hover:border-neutral-950
                  hover:bg-neutral-950
                  hover:text-white
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-neutral-950
                  focus-visible:ring-offset-2
                "
              >
                {user ? <LogOut className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {user ? "Log out" : "Account"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onCartOpen?.();
                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-neutral-950
                  px-3 py-3
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-neutral-800
                  active:scale-[0.97]
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#9a7a42]
                  focus-visible:ring-offset-2
                "
              >
                <ShoppingBag className="h-4 w-4" />
                Cart
              </button>
            </div>

            {/* Bottom */}
            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                border-t
                border-neutral-200
                pt-6
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-neutral-400
                "
              >
                BSCENTS
              </span>

              <span className="hidden text-xs font-light text-neutral-400 min-[360px]:block">
                Find your signature scent.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =====================================================
   ACTION BUTTON
===================================================== */

function ActionButton({ icon: Icon, label, count = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        relative
        flex h-10 w-10
        items-center
        justify-center
        rounded-full
        text-neutral-600
        transition-all
        duration-300
        hover:bg-neutral-950
        hover:text-white
        active:scale-90
        outline-none
        focus-visible:ring-2
        focus-visible:ring-neutral-950
        focus-visible:ring-offset-2
      "
      aria-label={label}
    >
      <Icon
        className="
          h-[18px]
          w-[18px]
          stroke-[1.6]
          transition-transform
          duration-300
          group-hover:scale-105
        "
      />

      {count > 0 && (
        <span
          className="
            absolute
            -right-0.5
            -top-0.5
            flex h-4
            min-w-4
            items-center
            justify-center
            rounded-full
            bg-neutral-950
            px-1
            text-[9px]
            font-medium
            text-white
            ring-2
            ring-white
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}
