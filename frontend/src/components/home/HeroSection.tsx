"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";

const POPULAR_SEARCHES = ["UI Designer", "UX Researcher", "Android", "Admin"];

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative bg-linear-to-br from-indigo-50 via-purple-50 to-slate-100 overflow-hidden min-h-[88vh] flex items-center">
      {/* Decorative diamonds (right side) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block">
        <svg
          className="absolute top-12 right-64 opacity-20"
          width="120"
          height="120"
          viewBox="0 0 120 120"
        >
          <rect
            x="30"
            y="0"
            width="60"
            height="60"
            rx="4"
            transform="rotate(45 60 30)"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </svg>
        <svg
          className="absolute top-40 right-20 opacity-15"
          width="180"
          height="180"
          viewBox="0 0 180 180"
        >
          <rect
            x="45"
            y="0"
            width="90"
            height="90"
            rx="4"
            transform="rotate(45 90 45)"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
        </svg>
        <svg
          className="absolute bottom-20 right-48 opacity-10"
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <rect
            x="35"
            y="0"
            width="70"
            height="70"
            rx="4"
            transform="rotate(45 70 35)"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-tight mb-6">
              Discover
              <br />
              more than{" "}
              <span className="relative inline-block">
                <span className="text-indigo-600">5000+ Jobs</span>
                {/* Brush underline */}
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C50 4 100 2 150 5C200 8 250 7 298 3"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-lg leading-relaxed mb-10 mt-4">
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-0 overflow-hidden mb-5"
            >
              {/* Job search */}
              <div className="flex items-center gap-3 px-5 py-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
              </div>
              {/* Location */}
              <div className="flex items-center gap-3 px-5 py-4 sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Florence, Italy"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm font-medium"
                />
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              {/* Button */}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-4 text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                Search my job
              </button>
            </form>

            {/* Popular searches */}
            <p className="text-sm text-gray-500">
              <span className="font-medium text-gray-700">Popular :</span>{" "}
              {POPULAR_SEARCHES.map((tag, i) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearch(tag);
                    router.push(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {tag}
                  {i < POPULAR_SEARCHES.length - 1 ? ", " : ""}
                </button>
              ))}
            </p>
          </div>

          {/* RIGHT — Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background shape */}
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
              <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-120 lg:h-120 bg-indigo-100/60 rounded-full" />
            </div>
            <div className="relative z-10">
              <Image
                src="/happy-man.webp"
                alt="Job seeker"
                width={520}
                height={580}
                className="object-contain drop-shadow-xl max-h-130 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
