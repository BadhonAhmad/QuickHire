import Link from "next/link";
import { MapPin, Clock, DollarSign, Building2, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job;
  variant?: "default" | "compact";
}

export default function JobCard({ job, variant = "default" }: JobCardProps) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getCompanyInitial = (company: string) => {
    return company.charAt(0).toUpperCase();
  };

  const companyColors: Record<string, string> = {
    A: "bg-red-500",
    B: "bg-blue-500",
    C: "bg-green-500",
    D: "bg-yellow-500",
    E: "bg-purple-500",
    F: "bg-pink-500",
    G: "bg-indigo-500",
    H: "bg-teal-500",
    I: "bg-orange-500",
    J: "bg-cyan-500",
    K: "bg-lime-500",
    L: "bg-emerald-500",
    M: "bg-violet-500",
    N: "bg-rose-500",
    O: "bg-sky-500",
    P: "bg-amber-500",
    Q: "bg-fuchsia-500",
    R: "bg-red-600",
    S: "bg-blue-600",
    T: "bg-green-600",
    U: "bg-purple-600",
    V: "bg-pink-600",
    W: "bg-indigo-600",
    X: "bg-teal-600",
    Y: "bg-orange-600",
    Z: "bg-cyan-600",
  };

  const initial = getCompanyInitial(job.company);
  const bgColor = companyColors[initial] || "bg-gray-500";

  if (variant === "compact") {
    return (
      <Link href={`/jobs/${job.id}`}>
        <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0`}
            >
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
                </div>
                {job.is_featured === 1 && (
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-1" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="group bg-white border border-gray-200 rounded-xl p-7 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div
            className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center text-white font-bold text-xl`}
          >
            {initial}
          </div>
          <div className="flex items-center gap-2">
            {job.is_featured === 1 && (
              <Badge variant="warning">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            <Badge variant="purple">{job.type}</Badge>
          </div>
        </div>

        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
          {job.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Building2 className="w-4 h-4" />
          <span>{job.company}</span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-5 grow">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              {job.salary}
            </span>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400">
          {timeAgo(job.created_at)}
        </div>
      </div>
    </Link>
  );
}
