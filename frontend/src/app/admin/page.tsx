"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Briefcase,
  Eye,
  Users,
  BarChart3,
  X,
  MapPin,
  Building2,
  Calendar,
  FileText,
} from "lucide-react";
import {
  getJobs,
  createJob,
  deleteJob,
  getApplications,
  deleteApplication,
  getJobStats,
} from "@/lib/api";
import { CATEGORIES, JOB_TYPES } from "@/lib/constants";
import type { Job, Application, JobStats, Pagination } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type Tab = "jobs" | "applications" | "create";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [jobsPagination, setJobsPagination] = useState<Pagination | null>(null);
  const [appsPagination, setAppsPagination] = useState<Pagination | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [jobsPage, setJobsPage] = useState(1);
  const [appsPage, setAppsPage] = useState(1);

  // Create job form
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    category: "Technology",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
    is_featured: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "job" | "app";
    id: number;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await getJobs({ page: jobsPage, limit: 10 });
      setJobs(res.data);
      setJobsPagination(res.pagination || null);
    } catch {
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }, [jobsPage]);

  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await getApplications({ page: appsPage, limit: 10 });
      setApplications(res.data);
      setAppsPagination(res.pagination || null);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  }, [appsPage]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getJobStats();
      setStats(res.data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchStats();
  }, [fetchJobs, fetchApplications, fetchStats]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.company.trim()) errors.company = "Company is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setCreating(true);
    try {
      await createJob(formData);
      setCreateSuccess(true);
      setFormData({
        title: "",
        company: "",
        location: "",
        category: "Technology",
        type: "Full-time",
        salary: "",
        description: "",
        requirements: "",
        is_featured: false,
      });
      fetchJobs();
      fetchStats();
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err) {
      setFormErrors({
        form: err instanceof Error ? err.message : "Failed to create job",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "job") {
        await deleteJob(deleteTarget.id);
        fetchJobs();
        fetchStats();
      } else {
        await deleteApplication(deleteTarget.id);
        fetchApplications();
      }
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "jobs",
      label: "Job Listings",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "applications",
      label: "Applications",
      icon: <FileText className="w-4 h-4" />,
    },
    { id: "create", label: "Post New Job", icon: <Plus className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-1">
            Manage job listings and applications
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalJobs}
                  </p>
                  <p className="text-xs text-gray-500">Total Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalApplications}
                  </p>
                  <p className="text-xs text-gray-500">Applications</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.categories}
                  </p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.locations}
                  </p>
                  <p className="text-xs text-gray-500">Locations</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {/* JOB LISTINGS TAB */}
            {activeTab === "jobs" && (
              <div>
                {loadingJobs ? (
                  <LoadingSpinner />
                ) : jobs.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 pr-4">Job</th>
                            <th className="pb-3 pr-4 hidden sm:table-cell">
                              Category
                            </th>
                            <th className="pb-3 pr-4 hidden md:table-cell">
                              Type
                            </th>
                            <th className="pb-3 pr-4 hidden lg:table-cell">
                              Date
                            </th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {jobs.map((job) => (
                            <tr
                              key={job.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 pr-4">
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {job.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <Building2 className="w-3 h-3" />
                                    {job.company}
                                    <span className="hidden sm:inline">•</span>
                                    <MapPin className="w-3 h-3 hidden sm:block" />
                                    <span className="hidden sm:inline">
                                      {job.location}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-4 hidden sm:table-cell">
                                <Badge variant="purple">{job.category}</Badge>
                              </td>
                              <td className="py-4 pr-4 hidden md:table-cell">
                                <Badge variant="info">{job.type}</Badge>
                              </td>
                              <td className="py-4 pr-4 hidden lg:table-cell text-sm text-gray-500">
                                {formatDate(job.created_at)}
                              </td>
                              <td className="py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a
                                    href={`/jobs/${job.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() =>
                                      setDeleteTarget({
                                        type: "job",
                                        id: job.id,
                                        title: job.title,
                                      })
                                    }
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {jobsPagination && jobsPagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={jobsPage <= 1}
                          onClick={() => setJobsPage(jobsPage - 1)}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm text-gray-600">
                          Page {jobsPage} of {jobsPagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={jobsPage >= jobsPagination.totalPages}
                          onClick={() => setJobsPage(jobsPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No job listings yet</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={() => setActiveTab("create")}
                    >
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <div>
                {loadingApps ? (
                  <LoadingSpinner />
                ) : applications.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-900">
                                  {app.name}
                                </p>
                                <span className="text-gray-300">•</span>
                                <a
                                  href={`mailto:${app.email}`}
                                  className="text-sm text-indigo-600 hover:underline"
                                >
                                  {app.email}
                                </a>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Applied for:{" "}
                                <span className="font-medium text-gray-700">
                                  {app.job_title || "Unknown Position"}
                                </span>
                                {app.job_company && (
                                  <span className="text-gray-400">
                                    {" "}
                                    at {app.job_company}
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <a
                                  href={app.resume_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:underline font-medium"
                                >
                                  View Resume →
                                </a>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(app.created_at)}
                                </span>
                              </div>
                              {app.cover_note && (
                                <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {app.cover_note}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: "app",
                                  id: app.id,
                                  title: `${app.name}'s application`,
                                })
                              }
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {appsPagination && appsPagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={appsPage <= 1}
                          onClick={() => setAppsPage(appsPage - 1)}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm text-gray-600">
                          Page {appsPage} of {appsPagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={appsPage >= appsPagination.totalPages}
                          onClick={() => setAppsPage(appsPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No applications received yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* CREATE JOB TAB */}
            {activeTab === "create" && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Post a New Job
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill in the details below to create a new job listing
                </p>

                {createSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Job posted successfully!
                  </div>
                )}

                {formErrors.form && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {formErrors.form}
                  </div>
                )}

                <form onSubmit={handleCreateJob} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Job Title"
                      placeholder="e.g. Senior React Developer"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      error={formErrors.title}
                      required
                    />
                    <Input
                      label="Company Name"
                      placeholder="e.g. Google"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      error={formErrors.company}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      error={formErrors.location}
                      required
                    />
                    <Input
                      label="Salary Range"
                      placeholder="e.g. $100,000 - $150,000"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Job Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      >
                        {JOB_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none ${
                        formErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Requirements{" "}
                      <span className="text-gray-400">(one per line)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder={
                        "3+ years of experience with React.js\nStrong TypeScript skills\nExcellent communication"
                      }
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requirements: e.target.value,
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="is_featured"
                      className="text-sm text-gray-700"
                    >
                      Mark as Featured Job
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={creating}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Publish Job Listing
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => !deleting && setDeleteTarget(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <strong className="text-gray-700">{deleteTarget.title}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={deleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
