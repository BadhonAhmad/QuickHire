import { API_BASE_URL } from "./constants";
import type {
  Job,
  Application,
  ApiResponse,
  CategoryCount,
  JobStats,
  ApplicationFormData,
  JobFormData,
} from "./types";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    // Extract field-level validation messages from backend errors array
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const messages = data.errors.map((e: { field: string; message: string }) => e.message);
      throw new Error(messages.join(". "));
    }
    throw new Error(data.message || "An error occurred");
  }

  return data;
}

// Jobs API
export async function getJobs(params?: {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Job[]>> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set("search", params.search);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.location) searchParams.set("location", params.location);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return fetchApi<ApiResponse<Job[]>>(`/jobs${query ? `?${query}` : ""}`);
}

export async function getJob(id: number): Promise<ApiResponse<Job>> {
  return fetchApi<ApiResponse<Job>>(`/jobs/${id}`);
}

export async function getFeaturedJobs(limit = 6): Promise<ApiResponse<Job[]>> {
  return fetchApi<ApiResponse<Job[]>>(`/jobs/featured?limit=${limit}`);
}

export async function getLatestJobs(limit = 6): Promise<ApiResponse<Job[]>> {
  return fetchApi<ApiResponse<Job[]>>(`/jobs/latest?limit=${limit}`);
}

export async function getCategories(): Promise<ApiResponse<CategoryCount[]>> {
  return fetchApi<ApiResponse<CategoryCount[]>>("/jobs/categories");
}

export async function getLocations(): Promise<ApiResponse<string[]>> {
  return fetchApi<ApiResponse<string[]>>("/jobs/locations");
}

export async function getJobStats(): Promise<ApiResponse<JobStats>> {
  return fetchApi<ApiResponse<JobStats>>("/jobs/stats");
}

export async function createJob(data: JobFormData): Promise<ApiResponse<Job>> {
  return fetchApi<ApiResponse<Job>>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteJob(id: number): Promise<ApiResponse<null>> {
  return fetchApi<ApiResponse<null>>(`/jobs/${id}`, {
    method: "DELETE",
  });
}

// Applications API
export async function submitApplication(
  data: ApplicationFormData
): Promise<ApiResponse<Application>> {
  return fetchApi<ApiResponse<Application>>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getApplications(params?: {
  page?: number;
  limit?: number;
  job_id?: number;
}): Promise<ApiResponse<Application[]>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.job_id) searchParams.set("job_id", String(params.job_id));

  const query = searchParams.toString();
  return fetchApi<ApiResponse<Application[]>>(`/applications${query ? `?${query}` : ""}`);
}

export async function deleteApplication(id: number): Promise<ApiResponse<null>> {
  return fetchApi<ApiResponse<null>>(`/applications/${id}`, {
    method: "DELETE",
  });
}
