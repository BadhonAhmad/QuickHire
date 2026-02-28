"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { submitApplication } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ApplicationFormProps {
  jobId: number;
  jobTitle: string;
}

export default function ApplicationForm({
  jobId,
  jobTitle,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resume_link: "",
    cover_note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.resume_link.trim()) {
      newErrors.resume_link = "Resume link is required";
    } else {
      try {
        new URL(formData.resume_link);
      } catch {
        newErrors.resume_link = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await submitApplication({
        job_id: jobId,
        ...formData,
      });
      setSuccess(true);
      setFormData({ name: "", email: "", resume_link: "", cover_note: "" });
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : "Failed to submit application. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Application Submitted!
        </h3>
        <p className="text-green-700 mb-4">
          Your application for <strong>{jobTitle}</strong> has been successfully
          submitted. We&apos;ll be in touch soon!
        </p>
        <Button variant="primary" onClick={() => setSuccess(false)}>
          Apply for Another Position
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Apply Now</h3>
        <p className="text-sm text-gray-500">
          Submit your application for {jobTitle}
        </p>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <Input
          label="Resume Link (URL)"
          type="url"
          placeholder="https://drive.google.com/your-resume"
          value={formData.resume_link}
          onChange={(e) =>
            setFormData({ ...formData, resume_link: e.target.value })
          }
          error={errors.resume_link}
          required
        />

        <div className="space-y-2">
          <label
            htmlFor="cover_note"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Cover Note <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="cover_note"
            rows={4}
            placeholder="Tell us why you're a great fit for this role..."
            value={formData.cover_note}
            onChange={(e) =>
              setFormData({ ...formData, cover_note: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-gray-400">
            {formData.cover_note.length}/2000 characters
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Application
        </Button>
      </form>
    </div>
  );
}
