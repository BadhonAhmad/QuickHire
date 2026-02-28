export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  is_featured: number;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  created_at: string;
  job_title?: string;
  job_company?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface JobStats {
  totalJobs: number;
  totalApplications: number;
  categories: number;
  locations: number;
}

export interface ApplicationFormData {
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
}

export interface JobFormData {
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  is_featured: boolean;
}
