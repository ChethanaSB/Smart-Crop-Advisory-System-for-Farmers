import React from "react";
import { Leaf, Clock, Bookmark, Share2 } from "lucide-react";

 
export function BlogCard({
  title,
  excerpt,
  cover,
  category = "Farming",
  author = { name: "Admin" },
  date,
  minutes = 4,
  tags = [],
  href,
  onClick,
}) {
  const published = date ? new Date(date) : null;
  const dateLabel = published ? published.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";

  const Wrapper = href ? "a" : "button";
  const wrapperProps = href
    ? { href, "aria-label": title }
    : { type: "button", onClick, "aria-label": title };

  return (
    <Wrapper
      {...wrapperProps}
      className="mt-11 group relative block overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {/* Media */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {/* Fallback illustration */}
            <Leaf className="h-10 w-10 opacity-30" aria-hidden="true" />
          </div>
        )}

        {/* Gradient + category pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        {category && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 backdrop-blur">
            <Leaf className="h-3.5 w-3.5" /> {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-green-700">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
        )}

        {/* Meta */}
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            {author?.avatar ? (
              <img
                src={author.avatar}
                alt=""
                className="h-6 w-6 rounded-full object-cover ring-1 ring-black/5"
                loading="lazy"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-green-100 ring-1 ring-black/5" />
            )}
            <span className="font-medium text-gray-700">{author?.name}</span>
          </div>

          {/* Dot */}
          <span className="select-none">•</span>

          {/* Date */}
          {dateLabel && <time dateTime={published?.toISOString()}>{dateLabel}</time>}

          {/* Dot */}
          <span className="select-none">•</span>

          {/* Read time */}
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{minutes} min</span>
        </div>

        {/* Tags */}
        {!!tags.length && (
          <div className="-m-1 mt-1 flex flex-wrap">
            {tags.map((t) => (
              <span
                key={t}
                className="m-1 inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-400">
            <button
              type="button"
              className="inline-flex items-center rounded-full p-2 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Bookmark"
              onClick={(e) => {
                e.preventDefault();
                // Hook up your bookmark logic here
              }}
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-full p-2 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Share"
              onClick={(e) => {
                e.preventDefault();
                if (navigator.share && href) {
                  navigator.share({ title, text: excerpt, url: href }).catch(() => {});
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <span className="pointer-events-none inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-green-700/10">
            Read Article
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

// Skeleton placeholder while loading
export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
      <div className="aspect-[16/9] w-full bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-11/12 rounded bg-gray-200" />
        <div className="mt-4 h-3 w-2/5 rounded bg-gray-200" />
      </div>
    </div>
  );
}

// Quick demo grid (safe to remove). Shows how to use BlogCard with sample data.
export default function BlogCardDemo() {
  const posts = [
    {
      title: "Monsoon-ready: 5 Soil Tips",
      excerpt:
        "Simple checks to keep your soil healthy this rainy season—pH, drainage, and organic matter.",
      cover:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2050&auto=format&fit=crop",
      category: "Soil Health",
      author: { name: "Agri Team", avatar: "https://i.pravatar.cc/100?img=12" },
      date: new Date().toISOString(),
      minutes: 3,
      tags: ["monsoon", "soil", "organic"],
      href: "#",
    },
    {
      title: "Drip Irrigation: Cost vs Yield",
      excerpt:
        "We compare upfront costs, water savings, and typical yield improvements from smallholders.",
      cover:
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2050&auto=format&fit=crop",
      category: "Irrigation",
      author: { name: "Krishi Lab", avatar: "https://i.pravatar.cc/100?img=5" },
      date: "2025-07-12",
      minutes: 5,
      tags: ["water", "efficiency"],
      href: "#",
    },
    {
      title: "Natural Pest Control That Works",
      excerpt:
        "Neem sprays, pheromone traps, and companion planting—what to try first.",
      cover:
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2050&auto=format&fit=crop",
      category: "Pest Management",
      author: { name: "Field Notes" },
      date: "2025-06-20",
      minutes: 4,
      tags: ["IPM", "neem", "traps"],
      href: "#",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4 mt-20">
      <h2 className="mb-4 text-2xl font-bold">Latest from the Farm Blog</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.title} {...p} />
        ))}
      </div>
    </div>
  );
}
