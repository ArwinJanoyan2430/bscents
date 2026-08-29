import { useState, useEffect } from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import Cart from "./components/Cart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import SigninPage from "./pages/SigninPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import { PageTransitionLoader } from "./components/Loader";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { supabase } from "./lib/supabase";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash && hash !== "#") {
      const targetId = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const googleLoginPending = sessionStorage.getItem(
      "bscents-google-login-pending",
    );
    if (!googleLoginPending || !supabase) return;

    sessionStorage.removeItem("bscents-google-login-pending");
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const isAdmin = data.session.user.app_metadata?.role === "admin";
        toast.success(isAdmin ? "Welcome, Admin" : "Signed in successfully");
      }
    });
  }, []);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.name === product.name,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (name, quantity) => {
    setCartItems((currentItems) =>
      quantity < 1
        ? currentItems.filter((item) => item.name !== name)
        : currentItems.map((item) =>
            item.name === name ? { ...item, quantity } : item,
          ),
    );
  };

  const removeFromCart = (name) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.name !== name),
    );
  };

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          top: "2%",
          bottom: "auto",
          transform: "translateY(-50%)",
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#171717",
            color: "#fff",
            borderRadius: "0",
            fontSize: "12px",
            letterSpacing: "0.04em",
            padding: "14px 18px",
          },
        }}
      />
      <PageTransitionLoader isLoading={isAdminRoute ? false : isLoading}>
        <div className="min-h-screen">
          <ScrollManager />
          {!isAdminRoute && (
            <NavBar
              cartCount={cartItems.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
              onCartOpen={() => setIsCartOpen(true)}
            />
          )}
          <div key={location.pathname} className={isAdminRoute ? "" : "page-enter"}>
            <Routes location={location}>
              <Route path="/" element={<Home onAddToCart={addToCart} />} />
              <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
              <Route path="/signin" element={<SigninPage />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </PageTransitionLoader>
      {!isAdminRoute && (
        <Cart
          isOpen={isCartOpen}
          items={cartItems}
          onClose={() => setIsCartOpen(false)}
          onQuantityChange={updateCartQuantity}
          onRemove={removeFromCart}
        />
      )}
    </>
  );
}

export default App;
