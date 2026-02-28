const { body, param, query, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateCreateJob = [
  body("title").trim().notEmpty().withMessage("Job title is required").isLength({ max: 200 }).withMessage("Title must be less than 200 characters"),
  body("company").trim().notEmpty().withMessage("Company name is required").isLength({ max: 200 }).withMessage("Company must be less than 200 characters"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("type").optional().isIn(["Full-time", "Part-time", "Contract", "Remote", "Internship"]).withMessage("Invalid job type"),
  body("salary").optional().trim(),
  body("description").trim().notEmpty().withMessage("Job description is required"),
  body("requirements").optional().trim(),
  body("is_featured").optional().isBoolean().withMessage("is_featured must be a boolean"),
  handleValidation,
];

const validateCreateApplication = [
  body("job_id").notEmpty().withMessage("Job ID is required").isInt({ min: 1 }).withMessage("Invalid job ID"),
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name must be less than 100 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address"),
  body("resume_link").trim().notEmpty().withMessage("Resume link is required").isURL().withMessage("Resume link must be a valid URL"),
  body("cover_note").optional().trim().isLength({ max: 2000 }).withMessage("Cover note must be less than 2000 characters"),
  handleValidation,
];

const validateIdParam = [
  param("id").isInt({ min: 1 }).withMessage("Invalid ID parameter"),
  handleValidation,
];

module.exports = {
  validateCreateJob,
  validateCreateApplication,
  validateIdParam,
  handleValidation,
};
