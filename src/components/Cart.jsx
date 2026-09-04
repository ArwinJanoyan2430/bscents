import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

const numericPrice = (price) => {
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(price);

export default function Cart({
  isOpen,
  items,
  onClose,
  onQuantityChange,
  onRemove,
  onCheckout,
}) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + numericPrice(item.price) * item.quantity,
    0,
  );

  const handleCheckout = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const completed = await onCheckout?.(address);
    setSubmitting(false);
    if (completed) {
      setAddress("");
      setShowCheckout(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden transition-visibility duration-500 ${
        isOpen ? "visible" : "invisible delay-500"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#f7f6f2] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-5 sm:px-7">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Your selection
            </p>
            <h2 id="cart-title" className="mt-1 font-serif text-3xl font-light">
              Shopping Bag <span className="text-base text-neutral-400">({itemCount})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 transition hover:bg-neutral-950 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-neutral-300 text-neutral-400">
                <ShoppingBag size={24} strokeWidth={1.3} />
              </span>
              <h3 className="mt-6 font-serif text-3xl font-light">Your bag is empty.</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-6 text-neutral-500">
                Discover a fragrance you love and add it to your collection.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-7 border-b border-neutral-950 pb-1 text-[10px] font-medium uppercase tracking-[0.2em]"
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7">
              {items.map((item) => (
                <article
                  key={item.name}
                  className="grid grid-cols-[88px_1fr] gap-4 border-b border-neutral-200 py-6"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#e9e5dc]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                          {item.brand}
                        </p>
                        <h3 className="mt-1 truncate font-serif text-lg font-light">
                          {item.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.name)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 text-neutral-400 transition hover:text-neutral-950"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="mt-2 text-xs font-medium">
                      {formatPrice(numericPrice(item.price))}
                    </p>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                      <div className="flex items-center border border-neutral-300">
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.name, item.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="grid h-8 w-8 place-items-center transition hover:bg-neutral-950 hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onQuantityChange(item.name, item.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="grid h-8 w-8 place-items-center transition hover:bg-neutral-950 hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(numericPrice(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="shrink-0 border-t border-neutral-200 bg-white px-5 py-6 sm:px-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">Subtotal</p>
                  <p className="mt-1 text-xs text-neutral-500">Shipping calculated at checkout</p>
                </div>
                <p className="font-serif text-2xl font-light">{formatPrice(subtotal)}</p>
              </div>
              {showCheckout && (
                <form onSubmit={handleCheckout} className="mt-5 border-t border-neutral-200 pt-5">
                  <label className="block text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    Shipping address
                    <textarea required value={address} onChange={(event) => setAddress(event.target.value)} rows={3} placeholder="House number, street, city, province, postal code" className="mt-2 w-full resize-none border border-neutral-300 p-3 text-sm font-normal normal-case leading-5 tracking-normal outline-none focus:border-neutral-950" />
                  </label>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 border border-neutral-300 px-4 py-3 text-[9px] uppercase tracking-[0.16em]">Back</button>
                    <button disabled={submitting} className="flex-[2] bg-neutral-950 px-4 py-3 text-[9px] uppercase tracking-[0.16em] text-white disabled:opacity-50">{submitting ? "Placing order…" : "Place order"}</button>
                  </div>
                </form>
              )}
              {!showCheckout && <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="mt-5 flex w-full items-center justify-center bg-neutral-950 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-neutral-800"
              >
                Checkout
              </button>}
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
