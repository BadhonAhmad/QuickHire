"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestJobs } from "@/lib/api";
import type { Job } from "@/lib/types";

const TAG_COLORS: Record<string, string> = {
  "Full-Time": "bg-green-50 text-green-600 border border-green-200",
  "Full Time": "bg-green-50 text-green-600 border border-green-200",
  Marketing: "bg-orange-50 text-orange-500 border border-orange-200",
  Design: "bg-indigo-50 text-indigo-600 border border-indigo-200",
  Business: "bg-blue-50 text-blue-600 border border-blue-200",
  Technology: "bg-cyan-50 text-cyan-600 border border-cyan-200",
};

const COMPANY_COLORS: Record<string, string> = {
  N: "bg-gray-800 text-white",
  D: "bg-indigo-100 text-indigo-600",
  T: "bg-violet-100 text-violet-600",
  P: "bg-orange-600 text-white",
  M: "bg-green-100 text-green-600",
  U: "bg-blue-100 text-blue-600",
  W: "bg-indigo-600 text-white",
};

const DEMO_LATEST_JOBS: Job[] = [
  {
    id: 801,
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    category: "Marketing",
    type: "Full-Time",
    salary: "$30k-$50k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 802,
    title: "Social Media Assistant",
    company: "Netlify",
    location: "Paris, France",
    category: "Marketing",
    type: "Full-Time",
    salary: "$35k-$55k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 803,
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Fransisco, USA",
    category: "Design",
    type: "Full-Time",
    salary: "$50k-$80k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 804,
    title: "Brand Designer",
    company: "Maze",
    location: "San Fransisco, USA",
    category: "Design",
    type: "Full-Time",
    salary: "$45k-$75k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 805,
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    category: "Marketing",
    type: "Full-Time",
    salary: "$55k-$85k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 806,
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    category: "Marketing",
    type: "Full-Time",
    salary: "$50k-$80k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 807,
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    category: "Marketing",
    type: "Full-Time",
    salary: "$60k-$90k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 808,
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    category: "Marketing",
    type: "Full-Time",
    salary: "$55k-$85k",
    description: "",
    requirements: "",
    is_featured: 0,
    created_at: new Date().toISOString(),
  },
];

function getTagsForJob(job: Job): string[] {
  return [job.type, "Marketing", "Design"];
}

export default function LatestJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await getLatestJobs(8);
        if (res.data && res.data.length > 0) {
          setJobs(res.data);
        } else {
          setJobs(DEMO_LATEST_JOBS);
        }
      } catch {
        setJobs(DEMO_LATEST_JOBS);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  const renderCard = (job: Job) => {
    const initial = job.company.charAt(0).toUpperCase();
    const companyColor = COMPANY_COLORS[initial] || "bg-gray-200 text-gray-700";
    const tags = getTagsForJob(job);

    return (
      <Link key={job.id} href={`/jobs/${job.id}`}>
        <div className="group flex items-start gap-5 bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer">
          {/* Company logo */}
          <div
            className={`w-12 h-12 ${companyColor} rounded-lg flex items-center justify-center font-bold text-lg shrink-0`}
          >
            {initial}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5 mb-3">
              {job.company} &bull; {job.location}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const color =
                  TAG_COLORS[tag] ||
                  "bg-gray-50 text-gray-500 border border-gray-200";
                return (
                  <span
                    key={tag}
                    className={`text-xs font-medium px-3 py-1 rounded-full ${color}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="relative py-16 sm:py-20 bg-gray-50 overflow-hidden">
      {/* Decorative diamonds */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none hidden lg:block">
        <svg
          className="absolute top-8 right-16 opacity-10"
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
          className="absolute top-48 right-4 opacity-5"
          width="160"
          height="160"
          viewBox="0 0 160 160"
        >
          <rect
            x="40"
            y="0"
            width="80"
            height="80"
            rx="4"
            transform="rotate(45 80 40)"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            <span className="italic font-serif">Latest</span>{" "}
            <span className="italic font-serif text-indigo-600">jobs open</span>
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
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-50 rounded w-1/2 mb-3" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                      <div className="h-6 bg-gray-100 rounded-full w-14" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job) => renderCard(job))}
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
