"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Star,
  Briefcase,
  Share2,
} from "lucide-react";
import { getJob } from "@/lib/api";
import type { Job } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ApplicationForm from "@/components/jobs/ApplicationForm";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const id = Number(params.id);
        const res = await getJob(id);
        setJob(res.data);
      } catch {
        setJob(null);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            This job listing may have been removed or doesn&apos;t exist.
          </p>
          <Link href="/jobs">
            <Button variant="primary">Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  const companyInitial = job.company.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Company Avatar */}
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
                {companyInitial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {job.title}
                  </h1>
                  {job.is_featured === 1 && (
                    <Badge variant="warning">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setShowApplyForm(true);
                  setTimeout(() => {
                    document
                      .getElementById("apply-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.split("\n").map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Form */}
            <div id="apply-form">
              {showApplyForm ? (
                <ApplicationForm jobId={job.id} jobTitle={job.title} />
              ) : (
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Interested in this position?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Submit your application and take the next step in your
                    career.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowApplyForm(true)}
                  >
                    Apply for this Job
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Posted
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(job.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Job Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.location}
                    </p>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium">
                        Salary
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {job.salary}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Category
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                About the Company
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {companyInitial}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              </div>
              <Link
                href={`/jobs?search=${encodeURIComponent(job.company)}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all jobs from {job.company} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
