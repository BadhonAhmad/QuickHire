"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Palette,
  BarChart3,
  Megaphone,
  Landmark,
  Monitor,
  Code2,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import { getCategories } from "@/lib/api";
import type { CategoryCount } from "@/lib/types";

const CATEGORY_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultCount: number;
  }
> = {
  Design: {
    icon: Palette,
    defaultCount: 235,
  },
  Sales: {
    icon: BarChart3,
    defaultCount: 756,
  },
  Marketing: {
    icon: Megaphone,
    defaultCount: 140,
  },
  Finance: {
    icon: Landmark,
    defaultCount: 325,
  },
  Technology: {
    icon: Monitor,
    defaultCount: 436,
  },
  Engineering: {
    icon: Code2,
    defaultCount: 542,
  },
  Business: {
    icon: Briefcase,
    defaultCount: 211,
  },
  "Human Resource": {
    icon: Users,
    defaultCount: 346,
  },
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch {
        setCategories(
          Object.keys(CATEGORY_CONFIG).map((cat) => ({
            category: cat,
            count: 0,
          })),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const allCategories = Object.keys(CATEGORY_CONFIG).map((cat) => {
    const found = categories.find((c) => c.category === cat);
    const config = CATEGORY_CONFIG[cat];
    return { category: cat, count: found?.count || config.defaultCount };
  });

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore by <span className="text-indigo-600">category</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-7 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg mb-6" />
                <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {allCategories.map(({ category, count }) => {
              const config = CATEGORY_CONFIG[category];
              const Icon = config.icon;
              const isHovered = hoveredCategory === category;

              return (
                <Link
                  key={category}
                  href={`/jobs?category=${encodeURIComponent(category)}`}
                  className={`group relative rounded-lg border p-6 sm:p-7 transition-all duration-300 ${
                    isHovered
                      ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 -translate-y-1"
                      : "bg-white border-gray-200 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
                  }`}
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 ${
                      isHovered
                        ? "bg-white/20"
                        : "bg-indigo-50 group-hover:bg-white/20"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isHovered
                          ? "text-white"
                          : "text-indigo-600 group-hover:text-white"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                      isHovered
                        ? "text-white"
                        : "text-gray-900 group-hover:text-white"
                    }`}
                  >
                    {category}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        isHovered
                          ? "text-indigo-100"
                          : "text-gray-500 group-hover:text-indigo-100"
                      }`}
                    >
                      {count} jobs available
                    </p>
                    <ArrowRight
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isHovered
                          ? "text-white"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile show all link */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
