export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const CATEGORIES = [
  "Design",
  "Sales",
  "Marketing",
  "Finance",
  "Technology",
  "Engineering",
  "Business",
  "Human Resources",
] as const;

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Remote",
  "Internship",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  Design: "🎨",
  Sales: "📊",
  Marketing: "📢",
  Finance: "💰",
  Technology: "💻",
  Engineering: "⚙️",
  Business: "💼",
  "Human Resources": "👥",
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Design: { bg: "bg-pink-50", text: "text-pink-700", icon: "bg-pink-100" },
  Sales: { bg: "bg-orange-50", text: "text-orange-700", icon: "bg-orange-100" },
  Marketing: { bg: "bg-purple-50", text: "text-purple-700", icon: "bg-purple-100" },
  Finance: { bg: "bg-green-50", text: "text-green-700", icon: "bg-green-100" },
  Technology: { bg: "bg-blue-50", text: "text-blue-700", icon: "bg-blue-100" },
  Engineering: { bg: "bg-red-50", text: "text-red-700", icon: "bg-red-100" },
  Business: { bg: "bg-amber-50", text: "text-amber-700", icon: "bg-amber-100" },
  "Human Resources": { bg: "bg-teal-50", text: "text-teal-700", icon: "bg-teal-100" },
};
