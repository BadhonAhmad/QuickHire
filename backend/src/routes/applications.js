const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const { validateCreateApplication, validateIdParam } = require("../middleware/validators");

// POST /api/applications - Submit a job application
router.post("/", validateCreateApplication, (req, res) => {
  try {
    const job = Job.findById(parseInt(req.body.job_id));
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const application = Application.create(req.body);
    res.status(201).json({
      success: true,
      data: application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
});

// GET /api/applications - Get all applications (Admin)
router.get("/", (req, res) => {
  try {
    const { page = 1, limit = 20, job_id } = req.query;
    const result = Application.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      job_id: job_id ? parseInt(job_id) : undefined,
    });

    res.json({
      success: true,
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
});

// GET /api/applications/:id - Get single application
router.get("/:id", validateIdParam, (req, res) => {
  try {
    const application = Application.findById(parseInt(req.params.id));
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ success: false, message: "Failed to fetch application" });
  }
});

// DELETE /api/applications/:id - Delete an application (Admin)
router.delete("/:id", validateIdParam, (req, res) => {
  try {
    const deleted = Application.delete(parseInt(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ success: false, message: "Failed to delete application" });
  }
});

module.exports = router;
