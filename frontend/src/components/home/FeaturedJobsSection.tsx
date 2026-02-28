"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedJobs } from "@/lib/api";
import type { Job } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "border-orange-200 text-orange-500 bg-orange-50",
  Design: "border-amber-200 text-amber-600 bg-amber-50",
  Business: "border-indigo-200 text-indigo-600 bg-indigo-50",
  Technology: "border-blue-200 text-blue-600 bg-blue-50",
  Finance: "border-green-200 text-green-600 bg-green-50",
  Engineering: "border-red-200 text-red-600 bg-red-50",
  Sales: "border-purple-200 text-purple-600 bg-purple-50",
  "Human Resource": "border-teal-200 text-teal-600 bg-teal-50",
};

const COMPANY_COLORS: Record<string, string> = {
  A: "bg-red-100 text-red-600",
  B: "bg-blue-100 text-blue-600",
  C: "bg-green-100 text-green-600",
  D: "bg-yellow-100 text-yellow-700",
  E: "bg-purple-100 text-purple-600",
  F: "bg-pink-100 text-pink-600",
  G: "bg-indigo-100 text-indigo-600",
  H: "bg-teal-100 text-teal-600",
  I: "bg-orange-100 text-orange-600",
  J: "bg-cyan-100 text-cyan-600",
  K: "bg-lime-100 text-lime-600",
  L: "bg-emerald-100 text-emerald-600",
  M: "bg-violet-100 text-violet-600",
  N: "bg-rose-100 text-rose-600",
  O: "bg-sky-100 text-sky-600",
  P: "bg-amber-100 text-amber-600",
  Q: "bg-fuchsia-100 text-fuchsia-600",
  R: "bg-red-600 text-white",
  S: "bg-blue-600 text-white",
  T: "bg-green-600 text-white",
  U: "bg-purple-600 text-white",
  V: "bg-pink-600 text-white",
  W: "bg-indigo-600 text-white",
  X: "bg-teal-600 text-white",
  Y: "bg-orange-600 text-white",
  Z: "bg-cyan-600 text-white",
};

const DEMO_JOBS: Job[] = [
  {
    id: 901,
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    category: "Marketing",
    type: "Full Time",
    salary: "$40k-$60k",
    description: "Revolut is looking for Email Marketing to help team ma ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 902,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, US",
    category: "Design",
    type: "Full Time",
    salary: "$50k-$80k",
    description: "Dropbox is looking for Brand Designer to help the team t ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 903,
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    category: "Marketing",
    type: "Full Time",
    salary: "$35k-$55k",
    description:
      "Pitch is looking for Customer Manager to join marketing t ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 904,
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    category: "Design",
    type: "Full Time",
    salary: "$45k-$70k",
    description:
      "Blinklist is looking for Visual Designer to help team desi ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 905,
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    category: "Marketing",
    type: "Full Time",
    salary: "$55k-$85k",
    description: "ClassPass is looking for Product Designer to help us...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 906,
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    category: "Design",
    type: "Full Time",
    salary: "$60k-$90k",
    description: "Canva is looking for Lead Engineer to help develop n ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 907,
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    category: "Marketing",
    type: "Full Time",
    salary: "$50k-$75k",
    description: "GoDaddy is looking for Brand Strategist to join the team...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 908,
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    category: "Technology",
    type: "Full Time",
    salary: "$65k-$95k",
    description: "Twitter is looking for Data Analyst to help team desi ...",
    requirements: "",
    is_featured: 1,
    created_at: new Date().toISOString(),
  },
];

// Map of jobs that should show multiple category tags (matching the design)
const MULTI_TAG_MAP: Record<string, string[]> = {
  "Email Marketing-Revolut": ["Marketing", "Design"],
  "Brand Designer-Dropbox": ["Design", "Business"],
  "Product Designer-ClassPass": ["Marketing", "Design"],
  "Lead Designer-Canva": ["Design", "Business"],
};

function getJobTags(job: Job): string[] {
  const key = `${job.title}-${job.company}`;
  return MULTI_TAG_MAP[key] || [job.category];
}

export default function FeaturedJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await getFeaturedJobs(8);
        if (res.data && res.data.length > 0) {
          setJobs(res.data);
        } else {
          setJobs(DEMO_JOBS);
        }
      } catch {
        setJobs(DEMO_JOBS);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            <span className="italic font-serif">Featured</span>{" "}
            <span className="italic font-serif text-indigo-600">jobs</span>
          </h2>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-gray-100 rounded-full" />
                  <div className="w-20 h-7 bg-gray-100 rounded border" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-50 rounded w-full mb-1" />
                <div className="h-4 bg-gray-50 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-50 rounded w-full mb-1" />
                <div className="h-3 bg-gray-50 rounded w-5/6 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-sm w-16" />
                  <div className="h-6 bg-gray-100 rounded-sm w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {jobs.map((job) => {
              const initial = job.company.charAt(0).toUpperCase();
              const companyColor =
                COMPANY_COLORS[initial] || "bg-gray-100 text-gray-600";

              // Determine category tags - some jobs show multiple
              const tags = getJobTags(job);

              return (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    {/* Top row: logo + badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 ${companyColor} rounded-full flex items-center justify-center font-bold text-lg`}
                      >
                        {initial}
                      </div>
                      <span className="text-xs font-medium border border-indigo-300 text-indigo-600 rounded px-3 py-1">
                        {job.type}
                      </span>
                    </div>

                    {/* Job title */}
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>

                    {/* Company · Location */}
                    <p className="text-sm text-gray-400 mb-3">
                      {job.company} · {job.location}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5 grow">
                      {job.description}
                    </p>

                    {/* Category tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {tags.map((tag) => {
                        const catColor =
                          CATEGORY_COLORS[tag] ||
                          "border-gray-200 text-gray-600 bg-gray-50";
                        return (
                          <span
                            key={tag}
                            className={`text-xs font-medium px-3 py-1 rounded-sm border ${catColor}`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
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
