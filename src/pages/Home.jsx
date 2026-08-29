import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Headphones,
  PackageCheck,
  Sparkles,
  Star,
  Heart,
  AtSign,
  Mail,
  ShoppingBag,
} from "lucide-react";
import yslHero from "../assets/home-images/ysl.png";
import ultrmlHero from "../assets/home-images/ultrml.png";
import mslf from "../assets/home-images/mslf.png";
import eros from "../assets/home-images/eros.png";
import dior from "../assets/home-images/dior.png";

const heroSlides = [
  { src: yslHero, alt: "YSL fragrance presentation" },
  { src: ultrmlHero, alt: "Ultra Male fragrance presentation" },
  { src: mslf, alt: "ysl myself le parfum" },
  { src: eros, alt: "versace eros" },
  { src: dior, alt: "dior sauvage edp" },
];

const brands = ["Dior", "Versace", "Chanel", "YSL", "Armani", "Burberry"];

const featuredProducts = [
  {
    name: "Sauvage Eau de Parfum",
    brand: "Dior",
    price: 8950,
    note: "Bergamot · Amber · Vanilla",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=90",
  },
  {
    name: "Libre Eau de Parfum",
    brand: "Yves Saint Laurent",
    price: 9250,
    note: "Lavender · Orange Blossom · Musk",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=90",
  },
  {
    name: "Coco Mademoiselle",
    brand: "Chanel",
    price: 10800,
    note: "Citrus · Rose · Patchouli",
    image:
      "https://images.unsplash.com/photo-1595425964071-2c1ec177f980?w=900&q=90",
  },
];

const values = [
  {
    icon: BadgeCheck,
    title: "Authenticity First",
    description:
      "Fragrances are carefully sourced from trusted suppliers so you can shop with confidence.",
  },
  {
    icon: Sparkles,
    title: "Curated Selection",
    description:
      "A handpicked selection of fragrances across different styles, occasions, and price points.",
  },
  {
    icon: PackageCheck,
    title: "Carefully Packed",
    description:
      "Every order is prepared with care to help your fragrance arrive safely and securely.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Need help choosing a fragrance or checking an order? We're here to assist you.",
  },
];

const testimonials = [
  {
    quote:
      "The perfume arrived well packed and exactly as expected. Definitely ordering again.",
    author: "Clara M.",
    rating: 5,
    product: "Sauvage Eau de Parfum",
    brand: "Dior",
    image: featuredProducts[0].image,
  },
  {
    quote:
      "I found the fragrance I was looking for without having to search through dozens of stores.",
    author: "James K.",
    rating: 5,
    product: "Libre Eau de Parfum",
    brand: "YSL",
    image: featuredProducts[1].image,
  },
  {
    quote:
      "Smooth ordering experience, beautiful packaging, and great customer service.",
    author: "Sophie L.",
    rating: 5,
    product: "Coco Mademoiselle",
    brand: "Chanel",
    image: featuredProducts[2].image,
  },
  {
    quote:
      "Eros has an unforgettable presence and lasts beautifully throughout the evening.",
    author: "Marco D.",
    rating: 5,
    product: "Eros Eau de Parfum",
    brand: "Versace",
    image: eros,
  },
  {
    quote:
      "A smooth ordering experience and a fragrance that feels refined from first spray.",
    author: "Nina P.",
    rating: 5,
    product: "Sauvage Eau de Parfum",
    brand: "Dior",
    image: dior,
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(price);

export default function Home({ onAddToCart }) {
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) =>
        (currentSlide + 1) % heroSlides.length,
      );
    }, 3000);

    return () => window.clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const reviewTimer = window.setInterval(() => {
      setActiveReviewSlide((currentSlide) =>
        (currentSlide + 1) % testimonials.length,
      );
    }, 4500);

    return () => window.clearInterval(reviewTimer);
  }, []);

  return (
    <main className="overflow-hidden bg-[#f7f6f2] text-neutral-950">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        id="home"
        className="relative min-h-[calc(100svh-4rem)] overflow-hidden lg:min-h-[calc(100svh-5rem)]"
      >
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={index === activeHeroSlide ? slide.alt : ""}
            aria-hidden={index !== activeHeroSlide}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeHeroSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Hero Content */}
        <div
          className="
            relative z-10
            mx-auto
            flex min-h-[calc(100svh-4rem)]
            max-w-7xl
            items-end
            px-5 pb-20
            sm:px-8
            lg:items-center
            lg:min-h-[calc(100svh-5rem)]
            lg:px-10
            lg:pb-0
          "
        >
          <div className="max-w-3xl">
            {/* Small label */}
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-12 bg-white/70" />

              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-[0.35em]
                  text-white/80
                  sm:text-xs
                "
              >
                Curated Fragrances
              </p>
            </div>

            {/* Heading */}
            <h1
              className="
                font-serif
                text-6xl
                font-light
                leading-[0.92]
                tracking-[-0.04em]
                text-white
                sm:text-7xl
                md:text-8xl
                lg:text-[105px]
              "
            >
              Find a scent
              <span className="block italic">made for you.</span>
            </h1>

            {/* Description */}
            <p
              className="
                mt-8
                max-w-xl
                text-base
                font-light
                leading-7
                text-white/80
                sm:text-lg
              "
            >
              Discover a curated selection of fragrances from brands you know
              and love — all in one place.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  bg-white
                  px-7 py-4
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-neutral-950
                  transition-all
                  duration-300
                  hover:bg-neutral-950
                  hover:text-white
                "
              >
                Top 3 fragrance
                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </a>

              <a
                href="#brands"
                className="
                  inline-flex
                  items-center
                  justify-center
                  border
                  border-white/60
                  px-7 py-4
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:border-white
                  hover:bg-white/10
                "
              >
                Explore Brands
              </a>
            </div>
          </div>
        </div>

        {/* Slideshow controls */}
        <div
          className="absolute bottom-8 left-5 z-20 flex gap-2 sm:left-8 lg:left-10"
          role="group"
          aria-label="Hero slides"
        >
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActiveHeroSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === activeHeroSlide ? "true" : undefined}
              className={`h-1 transition-all duration-300 ${
                index === activeHeroSlide
                  ? "w-10 bg-white"
                  : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Bottom Right Text */}
        <div
          className="
            absolute
            bottom-10
            right-10
            z-10
            hidden
            text-right
            text-white
            lg:block
          "
        >
          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-white/50
            "
          >
            BSCENTS
          </p>

          <p className="mt-2 font-serif text-xl font-light">
            Curated Fragrance Store
          </p>

          <p className="mt-1 text-xs text-white/60">
            Find your signature scent
          </p>
        </div>

        {/* Scroll */}
        <a
          href="#shop"
          className="
            absolute
            bottom-8
            left-1/2
            z-10
            hidden
            -translate-x-1/2
            flex-col
            items-center
            gap-2
            text-white/60
            md:flex
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.3em]
            "
          >
            Explore
          </span>

          <ArrowDown size={17} strokeWidth={1.4} className="animate-bounce" />
        </a>
      </section>

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-neutral-200 px-5 sm:px-8 lg:grid-cols-4 lg:px-10">
          {[
            "100% authentic",
            "Curated selection",
            "Secure checkout",
            "Customer care",
          ].map((item) => (
            <p
              key={item}
              className="py-4 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500 sm:text-[10px]"
            >
              {item}
            </p>
          ))}
        </div>
      </div>

      {/* =====================================================
          TOP FRAGRANCES
      ===================================================== */}

      <section
        id="shop"
        className="relative overflow-hidden bg-white px-5 py-24 text-neutral-950 sm:px-8 lg:px-10 lg:py-20"
      >
        <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-[#b99b62]/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-8 border-b border-neutral-200 pb-10 md:flex-row md:items-end md:justify-between lg:mb-16">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#c4a66b]">
                <span className="h-px w-8 bg-[#c4a66b]" /> The Private Edit
              </p>
              <h2 className="max-w-2xl font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Three scents of
                <span className="block italic text-neutral-400">distinction.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm font-light leading-7 text-neutral-500 md:text-right sm:text-base">
              An exclusive selection of enduring signatures, chosen for their
              character, craftsmanship, and unforgettable trail.
            </p>
          </div>

          {/* Swipeable portrait edit for mobile */}
          <div className="-mx-5 overflow-hidden bg-white py-8 sm:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featuredProducts.map((product, index) => (
                <article
                  key={`mobile-${product.name}`}
                  className="group w-[78vw] min-w-[250px] max-w-[310px] shrink-0 snap-center overflow-hidden rounded-[24px] border border-neutral-200 bg-white"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e1d7]">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-active:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.2em] text-neutral-800 backdrop-blur-md">
                      No. 0{index + 1}
                    </span>
                    <p className="absolute bottom-4 left-4 text-[8px] font-medium uppercase tracking-[0.25em] text-white/75">
                      Curated by BSCENTS
                    </p>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[#9a7a42]">
                          {product.brand}
                        </p>
                        <h3 className="mt-2 font-serif text-xl font-light leading-tight text-neutral-900">
                          {product.name}
                        </h3>
                      </div>
                      <p className="shrink-0 text-xs font-medium text-neutral-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <p className="mt-3 truncate text-[10px] font-light text-neutral-400">
                      {product.note}
                    </p>
                    <button
                      type="button"
                      onClick={() => onAddToCart?.(product)}
                      className="mt-5 flex w-full items-center justify-between border-t border-neutral-200 pt-4 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-800"
                    >
                      Add to bag
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white active:scale-90">
                        <ShoppingBag size={14} strokeWidth={1.5} />
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 text-neutral-400">
              <span className="h-px w-8 bg-neutral-300" />
              <p className="text-[8px] uppercase tracking-[0.24em]">Swipe the edit</p>
              <span className="h-px w-8 bg-neutral-300" />
            </div>
          </div>

          {/* Editorial layout for tablet and desktop */}
          <div className="hidden gap-5 sm:grid lg:grid-cols-2 lg:grid-rows-2">
            {featuredProducts.map((product, index) => (
              <article
                key={product.name}
                className={`group relative overflow-hidden border border-neutral-200 bg-[#f7f5f0] ${
                  index === 0
                    ? "lg:row-span-2"
                    : "sm:grid sm:grid-cols-[0.9fr_1.1fr] lg:grid-cols-[0.85fr_1.15fr]"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-neutral-900 ${
                    index === 0 ? "aspect-[4/5] lg:aspect-auto lg:min-h-[720px]" : "aspect-[4/3] sm:aspect-auto"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
                  <span className="absolute left-5 top-5 border border-white/25 bg-black/20 px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm">
                    No. 0{index + 1}
                  </span>
                  <button
                    type="button"
                    aria-label={`Save ${product.name}`}
                    className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-black"
                  >
                    <Heart size={16} strokeWidth={1.5} />
                  </button>
                  {index === 0 && (
                    <p className="absolute bottom-6 left-6 text-[9px] uppercase tracking-[0.3em] text-white/60 sm:bottom-8 sm:left-8">
                      The house favorite
                    </p>
                  )}
                </div>
                <div
                  className={`flex flex-col p-6 sm:p-8 ${
                    index === 0
                      ? "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-28 text-white"
                      : "justify-center text-neutral-950"
                  }`}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#c4a66b]">
                    {product.brand}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-5">
                    <h3 className={`font-serif font-light leading-tight ${index === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                      {product.name}
                    </h3>
                    <p className={`shrink-0 text-xs font-medium ${index === 0 ? "text-white/75" : "text-neutral-600"}`}>{formatPrice(product.price)}</p>
                  </div>
                  <p className={`mt-4 text-xs font-light leading-6 ${index === 0 ? "text-white/50" : "text-neutral-500"}`}>{product.note}</p>
                  <button
                    type="button"
                    onClick={() => onAddToCart?.(product)}
                    aria-label={`Quick add ${product.name} to cart`}
                    className={`mt-6 flex w-full items-center justify-between border-t pt-4 text-[9px] font-medium uppercase tracking-[0.24em] transition hover:text-[#a28247] ${
                      index === 0
                        ? "border-white/20 text-white"
                        : "border-neutral-300 text-neutral-950"
                    }`}
                  >
                    Add to bag
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c4a66b] text-black transition-transform group-hover:translate-x-1">
                      <ShoppingBag size={14} strokeWidth={1.5} />
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 flex items-center justify-center lg:mt-16">
            <a
              href="/shop"
              className="group inline-flex items-center gap-3 border-b border-neutral-400 pb-2 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-950 transition hover:border-[#a28247] hover:text-[#a28247]"
            >
              Explore the full collection
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED BRANDS
      ===================================================== */}

      <section
        id="brands"
        className="
          border-y
          border-neutral-200
          bg-white
          px-5 py-20
          sm:px-8
          lg:px-10 lg:py-24
        "
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.35em]
                text-neutral-500
              "
            >
              Discover
            </p>

            <h2
              className="
                mt-4
                font-serif
                text-4xl
                font-light
                sm:text-5xl
              "
            >
              Featured Brands
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-lg
                text-sm
                font-light
                leading-7
                text-neutral-500
              "
            >
              Explore fragrances from some of the world's most recognized
              fragrance houses.
            </p>
          </div>

          <div
            className="
              mt-14
              grid
              grid-cols-2
              border
              border-neutral-200
              sm:grid-cols-3
              lg:grid-cols-6
            "
          >
            {brands.map((brand) => (
              <a
                key={brand}
                href="/shop"
                className="
                  flex
                  h-28
                  items-center
                  justify-center
                  border-b
                  border-r
                  border-neutral-200
                  px-4
                  text-center
                  text-xs
                  font-medium
                  tracking-[0.15em]
                  text-neutral-500
                  transition-all
                  duration-300
                  hover:bg-neutral-950
                  hover:text-white
                  lg:border-b-0
                "
              >
                {brand.toUpperCase()}
              </a>
            ))}
          </div>

          <p className="mt-5 text-center text-[11px] text-neutral-400">
            Brand availability may vary.
          </p>
        </div>
      </section>

      {/* =====================================================
          WHY BSCENTS
      ===================================================== */}

      <section
        id="about"
        className="
          bg-white
          px-5 py-24
          sm:px-8
          lg:px-10 lg:py-36
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-16
            lg:grid-cols-[0.85fr_1.15fr]
            lg:gap-24
          "
        >
          {/* Left */}
          <div>
            <p
              className="
                mb-6
                text-[11px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-neutral-500
              "
            >
              Why BSCENTS
            </p>

            <h2
              className="
                max-w-lg
                font-serif
                text-5xl
                font-light
                leading-[1.05]
                tracking-tight
                sm:text-6xl
              "
            >
              Fragrance shopping,
              <span className="block italic text-neutral-500">
                made simple.
              </span>
            </h2>

            <p
              className="
                mt-8
                max-w-md
                text-base
                font-light
                leading-7
                text-neutral-600
              "
            >
              Discover fragrances you love without the overwhelming search. We
              bring standout scents together in one place.
            </p>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className={`
                    group
                    border-neutral-200
                    py-8
                    sm:p-8

                    ${index < 2 ? "sm:border-b" : ""}
                    ${index % 2 === 0 ? "sm:border-r" : ""}
                  `}
                >
                  <div
                    className="
                      mb-8
                      flex h-11 w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-neutral-300
                      transition-all
                      duration-300
                      group-hover:bg-neutral-950
                      group-hover:text-white
                    "
                  >
                    <Icon size={18} strokeWidth={1.4} />
                  </div>

                  <p className="mb-3 text-xs text-neutral-400">0{index + 1}</p>

                  <h3 className="font-serif text-2xl font-light">
                    {value.title}
                  </h3>

                  <p
                    className="
                      mt-4
                      text-sm
                      font-light
                      leading-6
                      text-neutral-600
                    "
                  >
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          EDITORIAL SECTION
      ===================================================== */}

      <section
        className="
          relative
          h-[60vh]
          min-h-[500px]
          overflow-hidden
          lg:h-[75vh]
        "
      >
        <img
          src={mslf}
          alt="Luxury perfume"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div
          className="
            absolute inset-0
            flex
            items-center
            justify-center
            px-6
            text-center
          "
        >
          <div className="max-w-3xl text-white">
            <p
              className="
                mb-6
                text-[10px]
                uppercase
                tracking-[0.4em]
                text-white/70
              "
            >
              Discover Your Signature
            </p>

            <h2
              className="
                font-serif
                text-5xl
                font-light
                leading-tight
                sm:text-6xl
                lg:text-8xl
              "
            >
              Every scent tells
              <span className="italic"> a story.</span>
            </h2>

            <p
              className="
                mx-auto
                mt-7
                max-w-xl
                text-sm
                font-light
                leading-7
                text-white/75
                sm:text-base
              "
            >
              From fresh everyday favorites to unforgettable evening scents,
              discover fragrances for every mood and moment.
            </p>

            <a
              href="#shop"
              className="
                group
                mt-9
                inline-flex
                items-center
                gap-3
                border-b
                border-white
                pb-2
                text-[11px]
                font-medium
                uppercase
                tracking-[0.25em]
              "
            >
              Explore fragrances
              <ArrowRight
                size={15}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}

      <section className="bg-white px-5 py-24 text-neutral-950 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col gap-8 border-b border-neutral-200 pb-10 md:flex-row md:items-end md:justify-between lg:mb-16">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#c4a66b]">
                <span className="h-px w-8 bg-[#c4a66b]" /> Client impressions
              </p>
              <h2 className="max-w-3xl font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Scents they love,
                <span className="block italic text-neutral-400">stories they share.</span>
              </h2>
            </div>

            <div className="flex items-center gap-4 md:pb-1">
              <p className="font-serif text-4xl font-light text-neutral-950">5.0</p>
              <div>
                <div className="flex gap-1 text-[#c4a66b]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={13} fill="currentColor" strokeWidth={1} />
                  ))}
                </div>
                <p className="mt-2 text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                  Verified reviews
                </p>
              </div>
            </div>
          </div>

          {/* Auto-advancing review carousel for mobile */}
          <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-gradient-to-b from-[#f7f4ed] to-white shadow-[0_18px_55px_rgba(23,23,23,0.08)] sm:hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${activeReviewSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <blockquote
                  key={`review-slide-${testimonial.author}`}
                  className="w-full min-w-full p-3"
                  aria-hidden={index !== activeReviewSlide}
                >
                  <div className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#e7e1d7]">
                      <img
                        src={testimonial.image}
                        alt={testimonial.product}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.18em] text-neutral-800 backdrop-blur-md">
                        Review 0{index + 1}
                      </span>
                      <div className="absolute inset-x-4 bottom-4">
                        <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[#e3c98f]">
                          {testimonial.brand}
                        </p>
                        <p className="mt-1 truncate font-serif text-lg font-light text-white">
                          {testimonial.product}
                        </p>
                      </div>
                    </div>
                    <div className="relative p-6 text-neutral-950">
                      <span className="pointer-events-none absolute right-4 top-0 font-serif text-7xl leading-none text-[#b99b62]/15">
                        “
                      </span>
                      <div className="relative flex gap-1 text-[#a28247]" aria-label={`${testimonial.rating} out of 5 stars`}>
                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                          <Star key={starIndex} size={13} fill="currentColor" strokeWidth={1} />
                        ))}
                      </div>
                      <p className="relative mt-5 font-serif text-xl font-light leading-relaxed text-neutral-700">
                        “{testimonial.quote}”
                      </p>
                      <footer className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 font-serif text-xs text-white">
                            {testimonial.author.charAt(0)}
                          </span>
                          <div>
                            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-800">
                              {testimonial.author}
                            </p>
                            <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-neutral-400">
                              Verified buyer
                            </p>
                          </div>
                        </div>
                        <span className="text-[8px] uppercase tracking-[0.16em] text-neutral-300">
                          5.0
                        </span>
                      </footer>
                    </div>
                  </div>
                </blockquote>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 pb-5 pt-1" role="group" aria-label="Review slides">
              {testimonials.map((testimonial, index) => (
                <button
                  key={`review-dot-${testimonial.author}`}
                  type="button"
                  onClick={() => setActiveReviewSlide(index)}
                  aria-label={`Show review ${index + 1}`}
                  aria-current={index === activeReviewSlide ? "true" : undefined}
                  className={`h-1 rounded-full transition-all ${
                    index === activeReviewSlide ? "w-7 bg-[#a28247]" : "w-2 bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Review grid for tablet and desktop */}
          <div className="hidden gap-x-5 gap-y-10 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.author}
                className="group flex flex-col overflow-hidden border border-neutral-200 bg-[#f8f6f1] transition duration-500 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_50px_rgba(23,23,23,0.08)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <img
                    src={testimonial.image}
                    alt={testimonial.product}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 text-[8px] font-medium uppercase tracking-[0.2em] text-white/80">
                    {testimonial.brand}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex gap-1 text-[#c4a66b]" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} size={11} fill="currentColor" strokeWidth={1} />
                    ))}
                  </div>
                  <p className="mt-5 font-serif text-xl font-light leading-relaxed text-neutral-700">
                    “{testimonial.quote}”
                  </p>
                  <footer className="mt-auto border-t border-neutral-200 pt-5">
                    <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-800">
                      {testimonial.author}
                    </p>
                    <p className="mt-2 truncate text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                      Verified buyer · {testimonial.product}
                    </p>
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-10"
      >
        <div className="relative mx-auto grid max-w-7xl overflow-hidden bg-[#141412] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#b99b62]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between px-7 py-14 text-white sm:px-12 sm:py-16 lg:min-h-[560px] lg:px-16 lg:py-20">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.35em] text-[#c4a66b]">
                <span className="h-px w-8 bg-[#c4a66b]" /> Follow our journey
              </p>
              <h2 className="mt-8 max-w-2xl font-serif text-5xl font-light leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Notes worth
                <span className="block italic text-white/45">remembering.</span>
              </h2>
              <p className="mt-7 max-w-lg text-sm font-light leading-7 text-white/55 sm:text-base">
                Discover new arrivals, fragrance stories, restocks, and special
                offers through our official Instagram page.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/15 pt-7">
              {["New releases", "Curated stories", "Private offers"].map((benefit, index) => (
                <div key={benefit}>
                  <p className="text-[8px] tracking-[0.2em] text-[#c4a66b]">0{index + 1}</p>
                  <p className="mt-2 text-[9px] uppercase leading-5 tracking-[0.16em] text-white/60">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-7 sm:flex-row sm:gap-8">
              <a
                href="https://www.instagram.com/bscents.labph"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/55 transition hover:text-[#c4a66b]"
              >
                <AtSign size={15} strokeWidth={1.5} />
                @bscents.labph
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=bscents.labph%40gmail.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/55 transition hover:text-[#c4a66b]"
              >
                <Mail size={15} strokeWidth={1.5} />
                bscents.labph@gmail.com
              </a>
            </div>
          </div>

          <div className="m-3 flex items-center bg-white px-6 py-14 sm:m-5 sm:px-10 lg:m-6 lg:px-12">
            <div className="w-full">
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">Stay updated</p>
              <h3 className="mt-4 font-serif text-4xl font-light leading-tight text-neutral-950 sm:text-5xl">
                See what’s new on Instagram.
              </h3>
              <p className="mt-5 text-sm font-light leading-7 text-neutral-500">
                Follow @bscents.labph for new products, restock announcements,
                fragrance features, and the latest updates from BSCENTS.
              </p>

              <a
                href="https://www.instagram.com/bscents.labph"
                target="_blank"
                rel="noreferrer"
                className="group mt-10 flex w-full items-center justify-between bg-neutral-950 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-[#a28247]"
              >
                <span className="flex items-center gap-3">
                  <AtSign size={16} strokeWidth={1.5} /> View Instagram
                </span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
