import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock3,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { cancelOrder, getMyOrders } from "../lib/storeApi";
import toast from "react-hot-toast";

const statusSteps = ["Confirmed", "Preparing", "Shipped", "Delivered"];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
      }).format(new Date(value))
    : "Date unavailable";

export default function Orders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(supabase));
  const [query, setQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        getMyOrders().then(setOrders).catch((error) => toast.error(error.message));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        getMyOrders().then(setOrders).catch((error) => toast.error(error.message));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const visibleOrders = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) =>
      `${order.id} ${order.status} ${(order.items || []).map((item) => item.name).join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  }, [orders, query]);

  const customerName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel order ${order.id}? This action cannot be undone.`)) return;
    setCancellingOrder(order.databaseId);
    try {
      await cancelOrder(order.databaseId);
      setOrders((current) => current.map((item) =>
        item.databaseId === order.databaseId ? { ...item, status: "Cancelled" } : item,
      ));
      toast.success(`Order ${order.id} has been cancelled.`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingOrder(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f6f2] pt-16 text-neutral-950 lg:pt-20">
      <section className="border-b border-neutral-200 px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.35em] text-[#9a7a42]">
            Your fragrance journey
          </p>
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="font-serif text-5xl font-light tracking-[-0.035em] sm:text-7xl">
                Your <span className="italic text-neutral-400">orders.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm font-light leading-7 text-neutral-500">
                {user
                  ? `Welcome back, ${customerName}. Follow every bottle from our shelves to your door.`
                  : "Track a purchase and revisit the fragrances you have chosen."}
              </p>
            </div>
            {orders.length > 0 && (
              <label className="flex w-full items-center gap-3 border-b border-neutral-400 py-3 md:w-80">
                <Search size={16} strokeWidth={1.5} />
                <span className="sr-only">Search orders</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search order or fragrance"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </label>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <LoadingState />
          ) : isSupabaseConfigured && !user ? (
            <SignedOutState />
          ) : visibleOrders.length === 0 ? (
            <EmptyState hasSearch={Boolean(query)} onClear={() => setQuery("")} />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-neutral-500">
                  Order history
                </p>
                <p className="text-xs text-neutral-400">
                  {visibleOrders.length} {visibleOrders.length === 1 ? "order" : "orders"}
                </p>
              </div>
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expanded={activeOrder === order.id}
                  onToggle={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
                  onCancel={() => handleCancel(order)}
                  cancelling={cancellingOrder === order.databaseId}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4" aria-label="Loading orders">
      {[1, 2].map((item) => (
        <div key={item} className="h-44 animate-pulse border border-neutral-200 bg-white" />
      ))}
    </div>
  );
}

function SignedOutState() {
  return (
    <div className="grid min-h-[420px] place-items-center border border-neutral-200 bg-white px-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f2eee5] text-[#9a7a42]">
          <Package size={22} strokeWidth={1.4} />
        </span>
        <h2 className="mt-7 font-serif text-4xl font-light">Sign in to see your orders.</h2>
        <p className="mt-4 text-sm font-light leading-6 text-neutral-500">
          Your order history, delivery updates, and purchase details will be waiting for you.
        </p>
        <Link to="/signin" className="mt-8 inline-flex items-center gap-3 bg-neutral-950 px-7 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#9a7a42]">
          Sign in <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, onClear }) {
  return (
    <div className="grid min-h-[420px] place-items-center border border-neutral-200 bg-white px-6 text-center">
      <div className="max-w-md">
        <ShoppingBag className="mx-auto text-neutral-300" size={42} strokeWidth={1} />
        <h2 className="mt-7 font-serif text-4xl font-light">
          {hasSearch ? "No matching orders." : "No orders yet."}
        </h2>
        <p className="mt-4 text-sm font-light leading-6 text-neutral-500">
          {hasSearch
            ? "Try a different order number, status, or fragrance name."
            : "When you find your signature scent, your purchase details will appear here."}
        </p>
        {hasSearch ? (
          <button type="button" onClick={onClear} className="mt-8 border-b border-neutral-950 pb-1 text-[9px] font-medium uppercase tracking-[0.2em]">
            Clear search
          </button>
        ) : (
          <Link to="/shop" className="mt-8 inline-flex items-center gap-3 bg-neutral-950 px-7 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#9a7a42]">
            Explore fragrances <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, onCancel, cancelling }) {
  const currentStep = Math.max(0, statusSteps.indexOf(order.status));
  const items = order.items || [];
  const total = order.total ?? items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <article className="border border-neutral-200 bg-white">
      <div className="grid gap-5 border-b border-neutral-100 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:p-7">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Order number</p>
          <p className="mt-2 text-sm font-medium">{order.id}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Placed</p>
          <p className="mt-2 text-sm">{formatDate(order.createdAt)}</p>
        </div>
        <span className="w-fit bg-[#f2eee5] px-4 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[#85672f]">
          {order.status || "Confirmed"}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex min-w-0 flex-1 items-center gap-4">
              {item.image && <img src={item.image} alt="" className="h-20 w-16 shrink-0 object-cover" />}
              <div className="min-w-[140px]">
                <p className="truncate font-serif text-lg font-light">{item.name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-400">Qty {item.quantity || 1}</p>
              </div>
            </div>
          ))}
          <div className="ml-auto shrink-0 text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Total</p>
            <p className="mt-2 font-serif text-xl">{formatPrice(total)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6">
          <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex items-center gap-2 border-b border-neutral-300 pb-1 text-[9px] font-medium uppercase tracking-[0.18em]">
            {expanded ? "Hide details" : "View details"} <ArrowRight className={`transition ${expanded ? "rotate-90" : ""}`} size={13} />
          </button>
          {["Confirmed", "Preparing"].includes(order.status) && (
            <button type="button" onClick={onCancel} disabled={cancelling} className="border-b border-red-300 pb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-red-600 transition hover:border-red-600 disabled:cursor-wait disabled:opacity-50">
              {cancelling ? "Cancelling…" : "Cancel order"}
            </button>
          )}
        </div>

        {expanded && (
          <div className="mt-7 border-t border-neutral-100 pt-7">
            {order.status === "Cancelled" ? (
              <div className="border border-red-100 bg-red-50 p-5 text-sm font-light text-red-700">
                This order was cancelled. Reserved inventory has been returned to the shop.
              </div>
            ) : <div className="grid grid-cols-4">
              {statusSteps.map((step, index) => {
                const complete = index <= currentStep;
                const Icon = index === 0 ? Check : index === 1 ? Clock3 : index === 2 ? Truck : Package;
                return (
                  <div key={step} className="relative text-center">
                    {index > 0 && <span className={`absolute right-1/2 top-4 h-px w-full ${complete ? "bg-[#9a7a42]" : "bg-neutral-200"}`} />}
                    <span className={`relative mx-auto grid h-8 w-8 place-items-center rounded-full ${complete ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                      <Icon size={13} strokeWidth={1.7} />
                    </span>
                    <p className="mt-3 text-[8px] uppercase tracking-[0.12em] text-neutral-500">{step}</p>
                  </div>
                );
              })}
            </div>}
            {order.shippingAddress && (
              <div className="mt-8 bg-[#f8f6f1] p-5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Delivering to</p>
                <p className="mt-2 text-sm font-light leading-6 text-neutral-600">{order.shippingAddress}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
