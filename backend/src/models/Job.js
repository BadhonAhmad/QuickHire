const { getDatabase } = require("../config/database");

class Job {
  static findAll({ search, category, location, page = 1, limit = 12 }) {
    const db = getDatabase();
    const conditions = [];
    const params = {};

    if (search) {
      conditions.push("(title LIKE @search OR company LIKE @search OR description LIKE @search)");
      params.search = `%${search}%`;
    }

    if (category && category !== "All") {
      conditions.push("category = @category");
      params.category = category;
    }

    if (location) {
      conditions.push("location LIKE @location");
      params.location = `%${location}%`;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM jobs ${where}`);
    const { total } = countStmt.get(params);

    const stmt = db.prepare(`SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`);
    const jobs = stmt.all({ ...params, limit, offset });

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare("SELECT * FROM jobs WHERE id = ?").get(id);
  }

  static findFeatured(limit = 6) {
    const db = getDatabase();
    return db.prepare("SELECT * FROM jobs WHERE is_featured = 1 ORDER BY created_at DESC LIMIT ?").all(limit);
  }

  static findLatest(limit = 6) {
    const db = getDatabase();
    return db.prepare("SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?").all(limit);
  }

  static getCategories() {
    const db = getDatabase();
    const rows = db.prepare("SELECT DISTINCT category, COUNT(*) as count FROM jobs GROUP BY category ORDER BY count DESC").all();
    return rows;
  }

  static getLocations() {
    const db = getDatabase();
    return db.prepare("SELECT DISTINCT location FROM jobs ORDER BY location").all().map((r) => r.location);
  }

  static create({ title, company, location, category, type, salary, description, requirements, is_featured }) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO jobs (title, company, location, category, type, salary, description, requirements, is_featured)
      VALUES (@title, @company, @location, @category, @type, @salary, @description, @requirements, @is_featured)
    `);
    const result = stmt.run({ title, company, location, category, type: type || "Full-time", salary, description, requirements, is_featured: is_featured ? 1 : 0 });
    return this.findById(result.lastInsertRowid);
  }

  static update(id, fields) {
    const db = getDatabase();
    const existing = this.findById(id);
    if (!existing) return null;

    const updates = [];
    const params = { id };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && key !== "id") {
        updates.push(`${key} = @${key}`);
        params[key] = key === "is_featured" ? (value ? 1 : 0) : value;
      }
    }

    if (updates.length === 0) return existing;

    db.prepare(`UPDATE jobs SET ${updates.join(", ")} WHERE id = @id`).run(params);
    return this.findById(id);
  }

  static delete(id) {
    const db = getDatabase();
    const result = db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
    return result.changes > 0;
  }

  static getStats() {
    const db = getDatabase();
    const totalJobs = db.prepare("SELECT COUNT(*) as count FROM jobs").get().count;
    const totalApplications = db.prepare("SELECT COUNT(*) as count FROM applications").get().count;
    const categories = db.prepare("SELECT COUNT(DISTINCT category) as count FROM jobs").get().count;
    const locations = db.prepare("SELECT COUNT(DISTINCT location) as count FROM jobs").get().count;
    return { totalJobs, totalApplications, categories, locations };
  }
}

module.exports = Job;
