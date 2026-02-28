const { getDatabase } = require("../config/database");

class Application {
  static create({ job_id, name, email, resume_link, cover_note }) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO applications (job_id, name, email, resume_link, cover_note)
      VALUES (@job_id, @name, @email, @resume_link, @cover_note)
    `);
    const result = stmt.run({ job_id, name, email, resume_link, cover_note: cover_note || "" });
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const db = getDatabase();
    return db.prepare(`
      SELECT a.*, j.title as job_title, j.company as job_company
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `).get(id);
  }

  static findAll({ page = 1, limit = 20, job_id } = {}) {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = {};

    if (job_id) {
      conditions.push("a.job_id = @job_id");
      params.job_id = job_id;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM applications a ${where}`);
    const { total } = countStmt.get(params);

    const stmt = db.prepare(`
      SELECT a.*, j.title as job_title, j.company as job_company
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT @limit OFFSET @offset
    `);
    const applications = stmt.all({ ...params, limit, offset });

    return {
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static findByJobId(jobId) {
    const db = getDatabase();
    return db.prepare("SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC").all(jobId);
  }

  static delete(id) {
    const db = getDatabase();
    const result = db.prepare("DELETE FROM applications WHERE id = ?").run(id);
    return result.changes > 0;
  }
}

module.exports = Application;
