import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Heart,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { createReview, getProducts, getReviews } from "../lib/storeApi";

const products = [
  { id: 1, name: "Sauvage Eau de Parfum", brand: "Dior", type: "For Him", price: 8950, notes: "Bergamot · Amber · Vanilla", badge: "Best seller", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=90" },
  { id: 2, name: "Libre Eau de Parfum", brand: "YSL", type: "For Her", price: 9250, notes: "Lavender · Orange Blossom · Musk", badge: "New", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=90" },
  { id: 3, name: "Coco Mademoiselle", brand: "Chanel", type: "For Her", price: 10800, notes: "Citrus · Rose · Patchouli", badge: "Iconic", image: "https://images.unsplash.com/photo-1595425964071-2c1ec177f980?w=900&q=90" },
  { id: 4, name: "Acqua di Giò", brand: "Armani", type: "For Him", price: 7800, notes: "Marine · Bergamot · Cedar", badge: "", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=90" },
  { id: 5, name: "L'Interdit", brand: "Givenchy", type: "For Her", price: 8450, notes: "White Floral · Tuberose · Vetiver", badge: "New", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=90" },
  { id: 6, name: "Oud Wood", brand: "Tom Ford", type: "Unisex", price: 16200, notes: "Oud · Sandalwood · Amber", badge: "Limited", image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=900&q=90" },
  { id: 7, name: "Eros Flame", brand: "Versace", type: "For Him", price: 7200, notes: "Mandarin · Pepper · Tonka", badge: "", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d79?w=900&q=90" },
  { id: 8, name: "Wood Sage & Sea Salt", brand: "Jo Malone", type: "Unisex", price: 9400, notes: "Sea Salt · Sage · Ambrette", badge: "Editor’s pick", image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=90" },
];

const categories = ["All", "For Him", "For Her", "Unisex"];
const shopReviews = [
  {
    quote: "The scent was beautifully packed, authentic, and arrived sooner than expected.",
    author: "Mara L.",
    product: products[1],
  },
  {
    quote: "BSCENTS made choosing a new fragrance feel simple. Sauvage was exactly right.",
    author: "Daniel R.",
    product: products[0],
  },
  {
    quote: "A polished experience from browsing to unboxing. I will definitely return.",
    author: "Bianca S.",
    product: products[2],
  },
  {
    quote: "Fresh, elegant, and incredibly wearable. Acqua di Giò has become my daily scent.",
    author: "Paolo M.",
    product: products[3],
  },
  {
    quote: "L'Interdit is sophisticated without feeling too heavy. The presentation was lovely.",
    author: "Camille T.",
    product: products[4],
  },
  {
    quote: "Oud Wood has remarkable depth and longevity. Every detail felt considered.",
    author: "Adrian C.",
    product: products[5],
  },
  {
    quote: "Eros Flame gets compliments every time I wear it. A confident evening fragrance.",
    author: "Luis A.",
    product: products[6],
  },
  {
    quote: "Quiet, clean, and distinctive. Wood Sage & Sea Salt is now a permanent favorite.",
    author: "Sofia N.",
    product: products[7],
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(price);

export default function Shop({ onAddToCart }) {
  const [catalog, setCatalog] = useState([]);
  const [category, setCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewDraft, setReviewDraft] = useState({
    author: "",
    quote: "",
    rating: 0,
    image: "",
    imageFile: null,
    productId: "",
  });

  useEffect(() => {
    Promise.all([getProducts(), getReviews()])
      .then(([productData, reviewData]) => {
        setCatalog(productData);
        setReviews(reviewData);
        setReviewDraft((current) => ({ ...current, productId: productData[0]?.id || "" }));
      })
      .catch((error) => {
        setCatalog(products);
        setReviews(shopReviews);
        toast.error(`Store data unavailable: ${error.message}`);
      });
  }, []);

  const brands = useMemo(() => [...new Set(catalog.map((product) => product.brand))], [catalog]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = catalog.filter((product) => {
      const matchesCategory = category === "All" || product.type === category;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesQuery = `${product.name} ${product.brand} ${product.notes}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesBrand && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "new") return Number(Boolean(b.badge)) - Number(Boolean(a.badge));
      return a.id - b.id;
    });
  }, [catalog, category, query, selectedBrands, sort]);

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const toggleBrand = (brand) => {
    setSelectedBrands((current) =>
      current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand],
    );
  };

  const toggleSaved = (id) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleReviewImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReviewDraft((current) => ({ ...current, image: String(reader.result), imageFile: file }));
    };
    reader.readAsDataURL(file);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewDraft.rating || !reviewDraft.image) return;

    const form = event.currentTarget;
    try {
      await createReview({ productId: reviewDraft.productId, author: reviewDraft.author.trim(), rating: reviewDraft.rating, body: reviewDraft.quote.trim(), imageFile: reviewDraft.imageFile });
      setReviews(await getReviews());
      setReviewDraft({ author: "", quote: "", rating: 0, image: "", imageFile: null, productId: catalog[0]?.id || "" });
      form.reset();
      toast.success("Your review has been published.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-neutral-950">
      <section className="border-b border-neutral-200 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-500">The fragrance collection</p>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.55fr]">
            <h1 className="max-w-4xl font-serif text-6xl font-light leading-[0.9] tracking-[-0.04em] sm:text-7xl lg:text-[96px]">
              Find the scent that feels <span className="italic text-neutral-400">like you.</span>
            </h1>
            <p className="max-w-md text-sm font-light leading-7 text-neutral-600 sm:text-base lg:justify-self-end">
              Explore authentic fragrances selected for every mood, memory, and moment—from quiet everyday signatures to unforgettable statements.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-neutral-200 bg-[#f7f6f2]/95 px-5 backdrop-blur-xl sm:px-8 lg:top-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 overflow-x-auto py-4 [scrollbar-width:none]">
          <div className="flex shrink-0 gap-2">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] transition ${category === item ? "bg-neutral-950 text-white" : "border border-neutral-300 hover:border-neutral-950"}`}>
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowFilters(true)} className="flex shrink-0 items-center gap-2 border-l border-neutral-300 pl-5 text-[10px] font-medium uppercase tracking-[0.16em] lg:hidden">
            <SlidersHorizontal size={15} /> Filters {selectedBrands.length > 0 && `(${selectedBrands.length})`}
          </button>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex max-w-md flex-1 items-center gap-3 border-b border-neutral-400 py-3 focus-within:border-neutral-950">
              <Search size={17} strokeWidth={1.5} />
              <span className="sr-only">Search fragrances</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by fragrance, brand, or note" className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}
            </label>
            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <p className="text-xs text-neutral-500">{visibleProducts.length} products</p>
              <label className="relative flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em]">
                <span className="hidden sm:inline">Sort by</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="appearance-none bg-transparent py-2 pr-7 outline-none">
                  <option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-0" />
              </label>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
            <aside className="hidden lg:block">
              <FilterPanel brands={brands} selectedBrands={selectedBrands} toggleBrand={toggleBrand} clear={() => setSelectedBrands([])} />
            </aside>

            <div>
              {visibleProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3">
                  {visibleProducts.map((product) => <ProductCard key={product.id} product={product} saved={saved.includes(product.id)} onSave={() => toggleSaved(product.id)} onAdd={() => onAddToCart?.(product)} />)}
                </div>
              ) : (
                <div className="grid min-h-96 place-items-center border border-neutral-200 bg-white px-6 text-center">
                  <div><p className="font-serif text-3xl font-light">No scents found.</p><p className="mt-3 text-sm text-neutral-500">Try another search or clear your filters.</p><button type="button" onClick={() => { setQuery(""); setSelectedBrands([]); setCategory("All"); }} className="mt-6 border-b border-neutral-950 pb-1 text-[10px] font-medium uppercase tracking-[0.2em]">Reset filters</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f6f2] px-4 py-16 text-neutral-950 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 border-b border-neutral-200 pb-8 sm:mb-14 sm:gap-8 sm:pb-9 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-[#c4a66b] sm:mb-5 sm:text-[10px] sm:tracking-[0.35em]">
                <span className="h-px w-8 bg-[#c4a66b]" /> Client impressions
              </p>
              <h2 className="max-w-2xl font-serif text-4xl font-light leading-[0.98] sm:text-6xl sm:leading-[0.95]">
                Scents they love,
                <span className="block italic text-neutral-400">stories they share.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <p className="font-serif text-3xl font-light sm:text-4xl">5.0</p>
              <div>
                <div className="flex gap-1 text-[#c4a66b]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={13} fill="currentColor" strokeWidth={1} />
                  ))}
                </div>
                <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-neutral-400">Verified reviews</p>
              </div>
            </div>
          </div>

          {/* Compact marketplace-style reviews for phones */}
          <div className="divide-y divide-neutral-200 border-y border-neutral-200 sm:hidden">
            {visibleReviews.map((review, reviewIndex) => (
              <article key={`mobile-${review.author}-${reviewIndex}`} className="py-6">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white font-serif text-sm text-neutral-500">
                    {review.author.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-800">{review.author}</p>
                    <div className="mt-1.5 flex gap-0.5 text-[#c08a32]" aria-label={`${review.rating ?? 5} out of 5 stars`}>
                      {Array.from({ length: review.rating ?? 5 }).map((_, starIndex) => (
                        <Star key={starIndex} size={14} fill="currentColor" strokeWidth={1} />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] leading-4 text-neutral-400">
                      Verified purchase · {review.product.name}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm font-light leading-6 text-neutral-700">
                  {review.quote}
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-neutral-200 bg-white">
                    <img
                      src={review.product.image}
                      alt={`${review.product.name} review`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="min-w-0 text-right text-[9px] uppercase leading-4 tracking-[0.14em] text-neutral-400">
                    {review.product.brand}
                  </p>
                </div>

                <div className="mt-4 bg-white px-4 py-3">
                  <p className="text-[10px] font-semibold text-neutral-800">BSCENTS response</p>
                  <p className="mt-1.5 text-xs font-light leading-5 text-neutral-500">
                    Thank you for sharing your fragrance experience with us.
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Editorial review cards for tablet and desktop */}
          <div className="hidden gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {visibleReviews.map((review) => (
              <blockquote
                key={review.author}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-[#f8f6f1] transition duration-500 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_50px_rgba(23,23,23,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 sm:aspect-[4/3]">
                  <img
                    src={review.product.image}
                    alt={review.product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 text-[8px] font-medium uppercase tracking-[0.2em] text-white/80">
                    {review.product.brand}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex gap-1 text-[#c4a66b]" aria-label={`${review.rating ?? 5} out of 5 stars`}>
                    {Array.from({ length: review.rating ?? 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={11} fill="currentColor" strokeWidth={1} />
                    ))}
                  </div>
                  <p className="mt-4 font-serif text-lg font-light leading-relaxed text-neutral-700 sm:mt-5 sm:text-xl">
                    “{review.quote}”
                  </p>
                  <footer className="mt-auto border-t border-neutral-200 pt-5">
                    <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-800">{review.author}</p>
                    <p className="mt-2 text-[8px] uppercase leading-4 tracking-[0.12em] text-neutral-400 sm:truncate sm:tracking-[0.14em]">
                      Verified buyer · {review.product.name}
                    </p>
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>

          {reviews.length > 4 && (
            <div className="mt-9 flex justify-center sm:mt-12">
              <button
                type="button"
                onClick={() => setShowAllReviews((current) => !current)}
                aria-expanded={showAllReviews}
                className="group inline-flex min-h-11 items-center gap-3 border-b border-neutral-400 px-2 pb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-700 transition hover:border-[#9a7a42] hover:text-[#9a7a42]"
              >
                {showAllReviews
                  ? "Show fewer reviews"
                  : `View more reviews (${reviews.length - 4})`}
                <span className={`text-base leading-none transition-transform ${showAllReviews ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
            </div>
          )}

          <div className="mt-12 grid overflow-hidden border border-neutral-200 bg-[#f8f6f1] sm:mt-16 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="flex flex-col justify-between bg-neutral-950 p-6 text-white sm:p-10 lg:p-12">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#c4a66b]">Share your experience</p>
                <h3 className="mt-4 font-serif text-3xl font-light leading-tight sm:mt-5 sm:text-5xl">How did your scent make you feel?</h3>
                <p className="mt-5 max-w-md text-sm font-light leading-7 text-white/50">Add a photo and tell the BSCENTS community about your fragrance.</p>
              </div>
              <p className="mt-8 text-[8px] uppercase leading-5 tracking-[0.16em] text-white/25 sm:mt-10 sm:tracking-[0.2em]">Your review appears instantly after submission</p>
            </div>

            <form onSubmit={submitReview} className="grid min-w-0 gap-7 p-5 sm:p-10 lg:grid-cols-[minmax(0,1fr)_180px] lg:p-12">
              <div className="min-w-0 space-y-6 sm:space-y-7">
                <label className="block">
                  <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">Your name</span>
                  <input type="text" required maxLength={40} value={reviewDraft.author} onChange={(event) => setReviewDraft((current) => ({ ...current, author: event.target.value }))} placeholder="Name" className="w-full border-b border-neutral-300 bg-transparent py-3 text-base outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 sm:text-sm" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">Fragrance</span>
                  <select required value={reviewDraft.productId} onChange={(event) => setReviewDraft((current) => ({ ...current, productId: event.target.value }))} className="w-full border-b border-neutral-300 bg-transparent py-3 text-sm outline-none focus:border-neutral-950">
                    {catalog.map((product) => <option key={product.id} value={product.id}>{product.brand} — {product.name}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">Your review</span>
                  <textarea required rows={5} maxLength={280} value={reviewDraft.quote} onChange={(event) => setReviewDraft((current) => ({ ...current, quote: event.target.value }))} placeholder="Tell us about your fragrance..." className="w-full resize-none border border-neutral-300 bg-white p-4 text-base leading-6 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 sm:text-sm" />
                  <span className="mt-2 block text-right text-[9px] text-neutral-400">{reviewDraft.quote.length}/280</span>
                </label>

                <fieldset>
                  <legend className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">Your rating</legend>
                  <div className="flex gap-1 sm:gap-2">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      return <button key={value} type="button" onClick={() => setReviewDraft((current) => ({ ...current, rating: value }))} aria-label={`${value} star${value > 1 ? "s" : ""}`} className={`grid h-11 w-11 place-items-center transition hover:scale-110 ${value <= reviewDraft.rating ? "text-[#a28247]" : "text-neutral-300"}`}><Star size={25} fill="currentColor" strokeWidth={1} /></button>;
                    })}
                  </div>
                </fieldset>
              </div>

              <div className="flex flex-col">
                <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-500">Add one image</p>
                <label className="group relative flex aspect-[16/10] flex-1 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-neutral-400 bg-white text-center transition hover:border-neutral-950 lg:aspect-auto lg:min-h-0">
                  <input type="file" accept="image/*" required={!reviewDraft.image} onChange={handleReviewImage} className="sr-only" />
                  {reviewDraft.image ? <img src={reviewDraft.image} alt="Review upload preview" className="absolute inset-0 h-full w-full object-cover" /> : <span className="px-5 text-[9px] uppercase leading-5 tracking-[0.2em] text-neutral-400 group-hover:text-neutral-950">Choose a fragrance photo</span>}
                </label>
                <button type="submit" disabled={!reviewDraft.rating || !reviewDraft.image} className="mt-5 min-h-12 bg-neutral-950 px-5 py-4 text-[9px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#a28247] disabled:cursor-not-allowed disabled:bg-neutral-300 sm:tracking-[0.22em]">Publish review</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {showFilters && <div className="fixed inset-0 z-[60] bg-black/35 lg:hidden" role="presentation" onClick={() => setShowFilters(false)}><div className="absolute inset-y-0 right-0 w-[min(88%,380px)] overflow-y-auto bg-[#f7f6f2] p-6" role="dialog" aria-modal="true" aria-label="Product filters" onClick={(event) => event.stopPropagation()}><div className="mb-8 flex items-center justify-between"><h2 className="font-serif text-3xl font-light">Filters</h2><button type="button" onClick={() => setShowFilters(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full border border-neutral-300"><X size={18} /></button></div><FilterPanel brands={brands} selectedBrands={selectedBrands} toggleBrand={toggleBrand} clear={() => setSelectedBrands([])} /><button type="button" onClick={() => setShowFilters(false)} className="mt-10 w-full bg-neutral-950 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white">Show {visibleProducts.length} products</button></div></div>}
    </main>
  );
}

function FilterPanel({ brands, selectedBrands, toggleBrand, clear }) {
  return <div><div className="flex items-center justify-between border-b border-neutral-300 pb-4"><h2 className="text-[10px] font-semibold uppercase tracking-[0.2em]">Brands</h2>{selectedBrands.length > 0 && <button type="button" onClick={clear} className="text-[9px] uppercase tracking-[0.15em] text-neutral-500 underline underline-offset-4">Clear</button>}</div><div className="space-y-4 pt-5">{brands.map((brand) => { const active = selectedBrands.includes(brand); return <label key={brand} className="flex cursor-pointer items-center justify-between text-sm font-light"><span>{brand}</span><input type="checkbox" checked={active} onChange={() => toggleBrand(brand)} className="sr-only" /><span className={`grid h-5 w-5 place-items-center border transition ${active ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300"}`}>{active && <Check size={12} />}</span></label>; })}</div><div className="mt-10 border-t border-neutral-300 pt-6"><p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Our promise</p><p className="mt-3 text-xs font-light leading-6 text-neutral-500">Authentic fragrances, thoughtfully selected and carefully packed.</p></div></div>;
}

function ProductCard({ product, saved, onSave, onAdd }) {
  return <article className="group min-w-0"><div className="relative aspect-[4/5] overflow-hidden bg-[#ece8e0]"><img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]" />{product.badge && <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-2 text-[7px] font-semibold uppercase tracking-[0.18em] backdrop-blur sm:left-4 sm:top-4 sm:text-[8px]">{product.badge}</span>}<button type="button" onClick={onSave} aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 transition sm:right-4 sm:top-4 sm:h-10 sm:w-10 ${saved ? "text-red-600" : "hover:bg-neutral-950 hover:text-white"}`}><Heart size={16} fill={saved ? "currentColor" : "none"} strokeWidth={1.5} /></button><button type="button" onClick={onAdd} className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-neutral-950 px-3 py-3.5 text-[8px] font-medium uppercase tracking-[0.16em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:inset-x-4 sm:bottom-4 sm:text-[10px]"><ShoppingBag size={14} /> Quick add</button></div><div className="pt-4 sm:pt-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="truncate text-[8px] font-medium uppercase tracking-[0.22em] text-neutral-400 sm:text-[9px]">{product.brand}</p><h3 className="mt-1.5 font-serif text-lg font-light leading-tight sm:text-xl">{product.name}</h3></div><p className="shrink-0 text-xs font-medium sm:text-sm">{formatPrice(product.price)}</p></div><p className="mt-2 hidden truncate text-[11px] font-light text-neutral-500 sm:block">{product.notes}</p></div></article>;
}
