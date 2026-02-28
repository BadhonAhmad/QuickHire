const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { validateCreateJob, validateIdParam } = require("../middleware/validators");

// GET /api/jobs - List all jobs with search/filter/pagination
router.get("/", (req, res) => {
  try {
    const { search, category, location, page = 1, limit = 12 } = req.query;
    const result = Job.findAll({
      search,
      category,
      location,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: result.jobs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/featured - Get featured jobs
router.get("/featured", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const jobs = Job.findFeatured(limit);
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch featured jobs" });
  }
});

// GET /api/jobs/latest - Get latest jobs
router.get("/latest", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const jobs = Job.findLatest(limit);
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch latest jobs" });
  }
});

// GET /api/jobs/categories - Get all categories with counts
router.get("/categories", (req, res) => {
  try {
    const categories = Job.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
});

// GET /api/jobs/locations - Get all unique locations
router.get("/locations", (req, res) => {
  try {
    const locations = Job.getLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch locations" });
  }
});

// GET /api/jobs/stats - Get job board stats
router.get("/stats", (req, res) => {
  try {
    const stats = Job.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// GET /api/jobs/:id - Get single job details
router.get("/:id", validateIdParam, (req, res) => {
  try {
    const job = Job.findById(parseInt(req.params.id));
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
});

// POST /api/jobs - Create a new job (Admin)
router.post("/", validateCreateJob, (req, res) => {
  try {
    const job = Job.create(req.body);
    res.status(201).json({ success: true, data: job, message: "Job created successfully" });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
});

// PUT /api/jobs/:id - Update a job (Admin)
router.put("/:id", validateIdParam, (req, res) => {
  try {
    const job = Job.update(parseInt(req.params.id), req.body);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job, message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id - Delete a job (Admin)
router.delete("/:id", validateIdParam, (req, res) => {
  try {
    const deleted = Job.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
});

module.exports = router;
