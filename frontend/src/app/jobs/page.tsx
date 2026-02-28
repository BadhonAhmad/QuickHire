"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, X, Briefcase } from "lucide-react";
import { getJobs, getLocations } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { Job, Pagination } from "@/lib/types";
import JobCard from "@/components/jobs/JobCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getJobs({
        search: search || undefined,
        category: category || undefined,
        location: location || undefined,
        page,
        limit: 12,
      });
      setJobs(res.data);
      setPagination(res.pagination || null);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, page]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await getLocations();
      setLocations(res.data);
    } catch {
      setLocations([]);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.replace(`/jobs${query ? `?${query}` : ""}`, { scroll: false });
  }, [search, category, location, page, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setPage(1);
  };

  const hasActiveFilters = search || category || location;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Find Jobs
            </h1>
          </div>
          <p className="text-gray-600">
            Discover {pagination?.total || 0} job opportunities waiting for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-10 shadow-sm">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, company, or keyword..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="sm:w-56 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent text-gray-900 focus:outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center justify-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-sm text-gray-600"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <Button type="submit" variant="primary" size="md">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Category Filters */}
            <div
              className={`mt-4 ${showFilters ? "block" : "hidden sm:block"}`}
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategory("");
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    !category
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      category === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  &quot;{search}&quot;
                  <button
                    onClick={() => setSearch("")}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  {category}
                  <button
                    onClick={() => setCategory("")}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  {location}
                  <button
                    onClick={() => setLocation("")}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 font-medium ml-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : jobs.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-7">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {jobs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {pagination?.total}
                </span>{" "}
                jobs
              </p>
            </div>

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        pageNum === page
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (pagination?.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any jobs matching your criteria. Try
              adjusting your search or filters.
            </p>
            <Button variant="primary" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
