const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "data", "quickhire.db");

let db;

function getDatabase() {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeTables();
    seedData();
  }
  return db;
}

function initializeTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'Full-time',
      salary TEXT,
      description TEXT NOT NULL,
      requirements TEXT,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      resume_link TEXT NOT NULL,
      cover_note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
  `);
}

function seedData() {
  const count = db.prepare("SELECT COUNT(*) as count FROM jobs").get();
  if (count.count > 0) return;

  const insert = db.prepare(`
    INSERT INTO jobs (title, company, location, category, type, salary, description, requirements, is_featured)
    VALUES (@title, @company, @location, @category, @type, @salary, @description, @requirements, @is_featured)
  `);

  const jobs = [
    {
      title: "Senior UI/UX Designer",
      company: "Google",
      location: "Mountain View, CA",
      category: "Design",
      type: "Full-time",
      salary: "$120,000 - $160,000",
      description: "We are looking for a Senior UI/UX Designer to join our product team. You will be responsible for creating intuitive and beautiful user experiences for millions of users worldwide. You'll collaborate with product managers, engineers, and researchers to define and deliver new features.",
      requirements: "5+ years of experience in UI/UX design\nProficiency in Figma, Sketch, or Adobe XD\nStrong portfolio demonstrating user-centered design process\nExperience with design systems\nExcellent communication skills",
      is_featured: 1,
    },
    {
      title: "Full Stack Developer",
      company: "Microsoft",
      location: "Seattle, WA",
      category: "Technology",
      type: "Full-time",
      salary: "$130,000 - $180,000",
      description: "Join Microsoft's cloud platform team as a Full Stack Developer. You will build and maintain web applications that power Azure services. Work with cutting-edge technologies and contribute to products used by millions of developers worldwide.",
      requirements: "4+ years of experience with React.js and Node.js\nExperience with cloud platforms (Azure preferred)\nStrong understanding of RESTful APIs\nDatabase design and optimization skills\nCS degree or equivalent experience",
      is_featured: 1,
    },
    {
      title: "Marketing Manager",
      company: "HubSpot",
      location: "Boston, MA",
      category: "Marketing",
      type: "Full-time",
      salary: "$95,000 - $125,000",
      description: "HubSpot is seeking a Marketing Manager to lead our content marketing strategy. You will develop and execute marketing campaigns that drive brand awareness and generate leads. This role requires a creative thinker with strong analytical skills.",
      requirements: "3+ years in digital marketing\nExperience with marketing automation tools\nStrong copywriting and content creation skills\nData-driven approach to marketing\nExcellent project management abilities",
      is_featured: 1,
    },
    {
      title: "Financial Analyst",
      company: "Goldman Sachs",
      location: "New York, NY",
      category: "Finance",
      type: "Full-time",
      salary: "$100,000 - $140,000",
      description: "Goldman Sachs is hiring a Financial Analyst to join our investment banking division. You will perform financial modeling, valuation analysis, and due diligence for M&A transactions. This is an excellent opportunity for career growth in finance.",
      requirements: "2+ years in financial analysis or investment banking\nAdvanced Excel and financial modeling skills\nCFA or progress toward CFA preferred\nStrong analytical and quantitative skills\nBachelor's degree in Finance or related field",
      is_featured: 1,
    },
    {
      title: "Sales Executive",
      company: "Salesforce",
      location: "San Francisco, CA",
      category: "Sales",
      type: "Full-time",
      salary: "$90,000 - $130,000 + Commission",
      description: "Salesforce is looking for a driven Sales Executive to join our enterprise team. You will be responsible for managing the full sales cycle from prospecting to closing deals with enterprise clients. Build lasting relationships and help businesses transform with our platform.",
      requirements: "3+ years of B2B SaaS sales experience\nProven track record of meeting/exceeding quotas\nExperience with CRM tools\nExcellent presentation skills\nStrong negotiation abilities",
      is_featured: 0,
    },
    {
      title: "DevOps Engineer",
      company: "Amazon",
      location: "Austin, TX",
      category: "Engineering",
      type: "Full-time",
      salary: "$140,000 - $190,000",
      description: "Amazon Web Services is seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You will design CI/CD pipelines, manage container orchestration, and ensure high availability of our services.",
      requirements: "5+ years in DevOps or SRE roles\nExpertise with AWS services\nExperience with Docker and Kubernetes\nProficiency in Python or Go\nInfrastructure as Code (Terraform/CloudFormation)",
      is_featured: 1,
    },
    {
      title: "Business Analyst",
      company: "Deloitte",
      location: "Chicago, IL",
      category: "Business",
      type: "Full-time",
      salary: "$80,000 - $110,000",
      description: "Deloitte is hiring a Business Analyst to work with our consulting team. You will analyze business processes, gather requirements, and recommend solutions to drive operational efficiency for our clients across various industries.",
      requirements: "2+ years as a Business Analyst\nStrong requirements gathering skills\nExperience with Agile methodologies\nProficiency in data analysis tools\nExcellent stakeholder management",
      is_featured: 0,
    },
    {
      title: "HR Coordinator",
      company: "Meta",
      location: "Menlo Park, CA",
      category: "Human Resources",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      description: "Meta is looking for an HR Coordinator to support our People Operations team. You will manage onboarding processes, coordinate employee programs, and help maintain a positive workplace culture for our growing team.",
      requirements: "1+ years in HR or People Operations\nExperience with HRIS systems\nStrong organizational skills\nExcellent interpersonal skills\nBachelor's degree in HR or related field",
      is_featured: 0,
    },
    {
      title: "React Native Developer",
      company: "Spotify",
      location: "Stockholm, Sweden",
      category: "Technology",
      type: "Remote",
      salary: "$110,000 - $150,000",
      description: "Spotify is seeking a React Native Developer to help build our next-generation mobile experiences. You will work on features used by over 500 million users, collaborating with designers and backend engineers to create seamless audio experiences.",
      requirements: "3+ years with React Native\nPublished apps on App Store/Google Play\nExperience with TypeScript\nUnderstanding of mobile CI/CD\nPassion for music and audio technology",
      is_featured: 1,
    },
    {
      title: "Data Scientist",
      company: "Netflix",
      location: "Los Gatos, CA",
      category: "Technology",
      type: "Full-time",
      salary: "$150,000 - $200,000",
      description: "Netflix is looking for a Data Scientist to join our content recommendation team. You will develop machine learning models that power personalized recommendations for 200+ million subscribers worldwide.",
      requirements: "PhD or MS in Computer Science, Statistics, or related field\nExperience with Python, TensorFlow, or PyTorch\nStrong background in statistical modeling\nExperience with A/B testing at scale\nPublications in ML/AI preferred",
      is_featured: 1,
    },
    {
      title: "Content Writer",
      company: "Shopify",
      location: "Ottawa, Canada",
      category: "Marketing",
      type: "Remote",
      salary: "$65,000 - $85,000",
      description: "Shopify is hiring a Content Writer to create compelling content for our merchant community. You will write blog posts, help documentation, and marketing copy that helps entrepreneurs succeed in e-commerce.",
      requirements: "2+ years of professional writing experience\nExperience with SEO best practices\nAbility to explain complex topics simply\nPortfolio of published work\nE-commerce knowledge is a plus",
      is_featured: 0,
    },
    {
      title: "Mechanical Engineer",
      company: "Tesla",
      location: "Fremont, CA",
      category: "Engineering",
      type: "Full-time",
      salary: "$110,000 - $145,000",
      description: "Tesla is seeking a Mechanical Engineer to join our vehicle engineering team. You will design and optimize mechanical components for our next-generation electric vehicles, working at the intersection of innovation and sustainability.",
      requirements: "BS in Mechanical Engineering\n3+ years in automotive or manufacturing\nProficiency in CAD software (SolidWorks/CATIA)\nExperience with FEA and CFD analysis\nPassion for sustainable energy",
      is_featured: 0,
    },
  ];

  const insertMany = db.transaction((jobs) => {
    for (const job of jobs) {
      insert.run(job);
    }
  });

  insertMany(jobs);
  console.log("Database seeded with sample jobs.");
}

module.exports = { getDatabase };
