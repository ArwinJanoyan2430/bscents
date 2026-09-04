import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { addProduct as createProduct, createReview, deleteProduct, deleteReview, getAdminData, updateOrderStatus, updateProduct } from "../lib/storeApi";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "transactions", label: "Transactions", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(price);

export default function AdminPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => setAdminUser(data.user ?? null));
    getAdminData()
      .then((data) => {
        setProducts(data.products);
        setReviews(data.reviews);
        setTransactions(data.transactions);
        setCustomers(data.customers);
      })
      .catch((error) => toast.error(`Unable to load dashboard: ${error.message}`));
  }, []);

  const adminName = (() => {
    const metadata = adminUser?.user_metadata ?? {};
    if (metadata.first_name || metadata.last_name) {
      return [metadata.first_name, metadata.last_name].filter(Boolean).join(" ");
    }
    if (metadata.given_name || metadata.family_name) {
      return [metadata.given_name, metadata.family_name].filter(Boolean).join(" ");
    }
    const parts = (metadata.full_name || metadata.name || "").trim().split(/\s+/).filter(Boolean);
    return parts.length > 1 ? `${parts[0]} ${parts.at(-1)}` : parts[0] || "Administrator";
  })();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Unable to log out. Please try again.");
      return;
    }
    navigate("/");
    toast.success("Logged out successfully");
  };

  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const lowStockCount = products.filter((product) => product.stock <= 5).length;
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(term));
  }, [products, query]);

  const changeStock = async (id, amount) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    try {
      const updated = await updateProduct(id, { stock: Math.max(0, product.stock + amount) });
      setProducts((current) => current.map((item) => item.id === id ? updated : item));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addProduct = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const product = await createProduct({
      name: String(data.get("name")).trim(),
      brand: String(data.get("brand")).trim(),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
        type: String(data.get("type")),
        notes: String(data.get("notes") || "").trim(),
        badge: String(data.get("badge") || "").trim(),
      }, data.get("image"));
      setProducts((current) => [...current, product]);
      event.currentTarget.reset();
      setShowProductForm(false);
      toast.success("Product added.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addReview = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await createReview({ productId: String(data.get("product")), author: String(data.get("author")).trim(), rating: Number(data.get("rating")), body: String(data.get("review")).trim(), imageFile: data.get("image") });
      const refreshed = await getAdminData();
      setReviews(refreshed.reviews);
      event.currentTarget.reset();
      toast.success("Review published.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderContent = () => {
    if (activeView === "inventory") return <InventoryView products={filteredProducts} query={query} setQuery={setQuery} changeStock={changeStock} removeProduct={async (id) => { try { await deleteProduct(id); setProducts((current) => current.filter((product) => product.id !== id)); toast.success("Product deleted."); } catch (error) { toast.error(error.message); } }} onAdd={() => setShowProductForm(true)} />;
    if (activeView === "reviews") return <ReviewsView reviews={reviews} addReview={addReview} removeReview={async (id) => { try { await deleteReview(id); setReviews((current) => current.filter((review) => review.id !== id)); toast.success("Review deleted."); } catch (error) { toast.error(error.message); } }} products={products} />;
    if (activeView === "transactions") return <TransactionsView transactions={transactions} updateStatus={async (id, status) => { const transaction = transactions.find((item) => item.id === id); try { await updateOrderStatus(transaction.databaseId, status); setTransactions((current) => current.map((item) => item.id === id ? { ...item, status } : item)); toast.success("Order updated."); } catch (error) { toast.error(error.message); } }} />;
    if (activeView === "customers") return <CustomersView customers={customers} />;
    return <Overview products={products} transactions={transactions} reviews={reviews} inventoryValue={inventoryValue} lowStockCount={lowStockCount} onNavigate={setActiveView} />;
  };

  return (
    <main className="min-h-screen bg-[#f4f2ed] text-neutral-950">
      <aside className={`fixed bottom-0 left-0 top-0 z-[70] flex h-[100dvh] w-[min(85vw,18rem)] flex-col overflow-y-auto overscroll-contain bg-neutral-950 px-5 py-7 text-white shadow-[20px_0_60px_rgba(0,0,0,0.25)] transition-transform duration-300 lg:w-72 lg:translate-x-0 lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-white/10 pb-7">
          <div><p className="font-serif text-2xl font-light tracking-[0.2em]">BSCENTS</p><p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-white/35">Administration</p></div>
          <button type="button" onClick={() => setIsSidebarOpen(false)} className="lg:hidden" aria-label="Close admin menu"><X size={19} /></button>
        </div>
        <nav className="mt-8 shrink-0 space-y-2">
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.16em] transition ${activeView === item.id ? "bg-white text-neutral-950" : "text-white/50 hover:bg-white/10 hover:text-white"}`}><Icon size={17} strokeWidth={1.5} />{item.label}</button>; })}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#c4a66b] text-neutral-950"><User size={17} /></span><div className="min-w-0"><p className="truncate text-xs">{adminName}</p><p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-white/35">Administrator</p></div></div>
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/40 transition hover:text-white"><LogOut size={15} /> Sign out</button>
        </div>
      </aside>

      {isSidebarOpen && <button type="button" aria-label="Close admin menu" className="fixed inset-0 z-[60] bg-black/40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-[55] flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white/95 px-5 shadow-[0_8px_30px_rgba(23,23,23,0.04)] backdrop-blur-xl sm:px-8 lg:h-20 lg:px-10">
          <button type="button" onClick={() => setIsSidebarOpen(true)} className="lg:hidden" aria-label="Open admin menu"><Menu size={20} /></button>
          <div className="hidden lg:block"><p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">BSCENTS Control Room</p></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex h-10 items-center gap-2 border border-neutral-200 bg-white px-3 text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-600 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white sm:px-4"
            >
              <Store size={15} strokeWidth={1.5} />
              <span className="hidden sm:inline">Customer mode</span>
            </button>
            <div className="hidden max-w-48 text-right sm:block"><p className="truncate text-xs font-medium">{adminName}</p><p className="truncate text-[9px] text-neutral-400">{adminUser?.email ?? ""}</p></div><span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white"><User size={15} /></span>
          </div>
        </header>

        <div className="p-5 sm:p-8 lg:p-10">{renderContent()}</div>
      </div>

      {showProductForm && <ProductModal onClose={() => setShowProductForm(false)} onSubmit={addProduct} />}
    </main>
  );
}

function PageHeading({ eyebrow, title, action }) {
  return <div className="mb-8 flex flex-col gap-5 border-b border-neutral-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9a7a42]">{eyebrow}</p><h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">{title}</h1></div>{action}</div>;
}

function Overview({ products, transactions, reviews, inventoryValue, lowStockCount, onNavigate }) {
  const cards = [
    ["Products", products.length, "inventory"], ["Inventory value", formatPrice(inventoryValue), "inventory"], ["Low stock", lowStockCount, "inventory"], ["Reviews", reviews.length, "reviews"],
  ];
  return <><PageHeading eyebrow="Dashboard" title="Store overview" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, target]) => <button key={label} type="button" onClick={() => onNavigate(target)} className="border border-neutral-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"><p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">{label}</p><p className="mt-5 font-serif text-3xl font-light">{value}</p></button>)}</div><div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><div className="border border-neutral-200 bg-white p-6"><h2 className="font-serif text-2xl font-light">Recent transactions</h2><div className="mt-5 divide-y divide-neutral-100">{transactions.slice(0, 4).map((item) => <div key={item.id} className="flex items-center justify-between gap-5 py-4"><div><p className="text-sm">{item.customer}</p><p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-neutral-400">{item.id} · {item.date}</p></div><p className="text-sm font-medium">{formatPrice(item.total)}</p></div>)}</div></div><div className="border border-neutral-200 bg-neutral-950 p-7 text-white"><p className="text-[9px] uppercase tracking-[0.25em] text-[#c4a66b]">Inventory alert</p><p className="mt-5 font-serif text-4xl font-light">{lowStockCount} products need attention.</p><button type="button" onClick={() => onNavigate("inventory")} className="mt-8 border-b border-white/50 pb-1 text-[9px] uppercase tracking-[0.2em]">Review inventory</button></div></div></>;
}

function InventoryView({ products, query, setQuery, changeStock, removeProduct, onAdd }) {
  return <><PageHeading eyebrow="Catalog" title="Inventory" action={<button type="button" onClick={onAdd} className="flex items-center gap-2 bg-neutral-950 px-5 py-3 text-[9px] uppercase tracking-[0.18em] text-white"><Plus size={14} /> Add product</button>} /><label className="mb-6 flex max-w-sm items-center gap-3 border-b border-neutral-300 py-3"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory" className="w-full bg-transparent text-sm outline-none" /></label><div className="overflow-x-auto border border-neutral-200 bg-white"><table className="w-full min-w-[760px] text-left"><thead className="border-b border-neutral-200 bg-[#f8f6f1] text-[8px] uppercase tracking-[0.2em] text-neutral-500"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Stock</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-neutral-100">{products.map((product) => <tr key={product.id}><td className="p-4"><p className="text-sm">{product.name}</p><p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-neutral-400">{product.brand}</p></td><td className="p-4 text-sm">{formatPrice(product.price)}</td><td className="p-4"><StockBadge stock={product.stock} /></td><td className="p-4"><div className="flex w-fit items-center border border-neutral-200"><button type="button" onClick={() => changeStock(product.id, -1)} className="h-8 w-8">−</button><span className="w-9 text-center text-xs">{product.stock}</span><button type="button" onClick={() => changeStock(product.id, 1)} className="h-8 w-8">+</button></div></td><td className="p-4"><div className="flex justify-end gap-2"><button type="button" aria-label={`Edit ${product.name}`} className="grid h-9 w-9 place-items-center border border-neutral-200"><Edit3 size={14} /></button><button type="button" onClick={() => removeProduct(product.id)} aria-label={`Delete ${product.name}`} className="grid h-9 w-9 place-items-center border border-neutral-200 text-red-500"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div></>;
}

function StockBadge({ stock }) { const label = stock === 0 ? "Out of stock" : stock <= 5 ? "Low stock" : "In stock"; return <span className={`inline-flex px-2.5 py-1 text-[8px] uppercase tracking-[0.14em] ${stock === 0 ? "bg-red-50 text-red-600" : stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{label}</span>; }

function ReviewsView({ reviews, addReview, removeReview, products }) {
  return <><PageHeading eyebrow="Community" title="Reviews" /><div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]"><form onSubmit={addReview} className="h-fit border border-neutral-200 bg-white p-6"><h2 className="font-serif text-2xl font-light">Add a review</h2><div className="mt-6 space-y-4"><AdminInput name="author" label="Customer name" /><label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">Product<select name="product" required className="mt-2 w-full border border-neutral-200 bg-white p-3 text-sm normal-case tracking-normal outline-none">{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">Rating<select name="rating" className="mt-2 w-full border border-neutral-200 bg-white p-3 text-sm normal-case tracking-normal"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option></select></label><label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">Review<textarea name="review" required rows={4} className="mt-2 w-full resize-none border border-neutral-200 p-3 text-sm normal-case tracking-normal outline-none" /></label><ImageFileInput name="image" label="Review image" /><button className="w-full bg-neutral-950 p-4 text-[9px] uppercase tracking-[0.2em] text-white">Publish review</button></div></form><div className="space-y-4">{reviews.map((review) => <article key={review.id} className="border border-neutral-200 bg-white p-6"><div className="flex items-start gap-5">{review.image && <img src={review.image} alt="" className="h-24 w-20 shrink-0 object-cover" />}<div className="min-w-0 flex-1"><div className="flex gap-1 text-[#a28247]">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={12} fill="currentColor" />)}</div><p className="mt-4 font-serif text-xl font-light">“{review.text}”</p><p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-neutral-400">{review.author} · {review.product}</p></div><button type="button" onClick={() => removeReview(review.id)} className="shrink-0 text-neutral-400 hover:text-red-500"><Trash2 size={15} /></button></div></article>)}</div></div></>;
}

function TransactionsView({ transactions, updateStatus }) { return <><PageHeading eyebrow="Orders" title="Transactions" /><div className="overflow-x-auto border border-neutral-200 bg-white"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-neutral-200 bg-[#f8f6f1] text-[8px] uppercase tracking-[0.2em] text-neutral-500"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-neutral-100">{transactions.map((item) => <tr key={item.id}><td className="p-4 text-xs font-medium">{item.id}</td><td className="p-4 text-sm">{item.customer}</td><td className="p-4 text-xs text-neutral-500">{item.date}</td><td className="p-4 text-sm font-medium">{formatPrice(item.total)}</td><td className="p-4"><select value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)} className="border border-neutral-200 bg-white p-2 text-xs"><option>Confirmed</option><option>Preparing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td></tr>)}</tbody></table></div></>; }

function CustomersView({ customers }) { return <><PageHeading eyebrow="Accounts" title="Customers" /><div className="overflow-x-auto border border-neutral-200 bg-white"><table className="w-full min-w-[680px] text-left"><thead className="border-b border-neutral-200 bg-[#f8f6f1] text-[8px] uppercase tracking-[0.2em] text-neutral-500"><tr><th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Joined</th><th className="p-4">Orders</th></tr></thead><tbody className="divide-y divide-neutral-100">{customers.map((customer) => <tr key={customer.id}><td className="p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-xs">{customer.name.charAt(0)}</span><p className="text-sm">{customer.name}</p></div></td><td className="p-4 text-sm text-neutral-500">{customer.email}</td><td className="p-4 text-xs text-neutral-500">{customer.joined}</td><td className="p-4 text-sm">{customer.orders}</td></tr>)}</tbody></table></div></>; }

function ProductModal({ onClose, onSubmit }) { return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 p-5" onMouseDown={onClose}><form onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-7 sm:p-9"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.22em] text-[#9a7a42]">Catalog</p><h2 className="mt-2 font-serif text-3xl font-light">Add product</h2></div><button type="button" onClick={onClose}><X size={18} /></button></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2"><AdminInput name="name" label="Product name" /></div><AdminInput name="brand" label="Brand" /><label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">Category<select name="type" className="mt-2 w-full border border-neutral-200 bg-white p-3 text-sm normal-case tracking-normal"><option>For Him</option><option>For Her</option><option>Unisex</option></select></label><AdminInput name="price" label="Price" type="number" min="0" /><AdminInput name="stock" label="Opening stock" type="number" min="0" /><div className="sm:col-span-2"><AdminInput name="notes" label="Fragrance notes" /></div><AdminInput name="badge" label="Badge" /><div className="sm:col-span-2"><ImageFileInput name="image" label="Product image" /></div></div><button className="mt-8 w-full bg-neutral-950 p-4 text-[9px] uppercase tracking-[0.2em] text-white">Upload and add product</button></form></div>; }

function ImageFileInput({ name, label }) { return <label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">{label}<input name={name} type="file" accept="image/jpeg,image/png,image/webp,image/gif" required className="mt-2 block w-full border border-dashed border-neutral-300 bg-[#f8f6f1] p-4 text-xs normal-case tracking-normal file:mr-4 file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-[9px] file:uppercase file:tracking-[0.15em] file:text-white" /><span className="mt-2 block text-[8px] normal-case tracking-normal text-neutral-400">JPG, PNG, WebP or GIF · maximum 5 MB</span></label>; }

function AdminInput({ label, ...props }) { return <label className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500">{label}<input required {...props} className="mt-2 w-full border border-neutral-200 p-3 text-sm normal-case tracking-normal outline-none focus:border-neutral-950" /></label>; }
