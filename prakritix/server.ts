import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-for-demo";

app.use(express.json());

// Database setup
const db = new Database("waste_management.db");

// Initialize DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    confidence REAL NOT NULL,
    bin_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS bins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT UNIQUE NOT NULL,
    fill_level INTEGER DEFAULT 0,
    status TEXT DEFAULT 'normal',
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed bins if empty
const binsCount = db.prepare("SELECT COUNT(*) as count FROM bins").get() as { count: number };
if (binsCount.count === 0) {
  const insertBin = db.prepare("INSERT INTO bins (type, fill_level, status) VALUES (?, ?, ?)");
  insertBin.run("Degradable", 45, "normal");
  insertBin.run("Non-Degradable", 80, "warning");
  insertBin.run("Metal", 10, "normal");
  insertBin.run("Hazardous", 95, "full");
} else {
  // Ensure we have the new bin types
  const currentBins = db.prepare("SELECT type FROM bins").all() as { type: string }[];
  const hasOldBins = currentBins.some(b => b.type === 'Biodegradable' || b.type === 'Recyclable' || b.type === 'Organic' || b.type === 'General');
  if (hasOldBins) {
    db.exec("DELETE FROM bins");
    const insertBin = db.prepare("INSERT INTO bins (type, fill_level, status) VALUES (?, ?, ?)");
    insertBin.run("Degradable", 45, "normal");
    insertBin.run("Non-Degradable", 80, "warning");
    insertBin.run("Metal", 10, "normal");
    insertBin.run("Hazardous", 95, "full");
  }
}

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    
    // Verify user still exists in database
    const dbUser = db.prepare("SELECT id FROM users WHERE id = ?").get(user.id);
    if (!dbUser) return res.sendStatus(401);
    
    req.user = user;
    next();
  });
};

// API Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insert = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    const info = insert.run(name, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: info.lastInsertRowid, name, email } });
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) return res.status(400).json({ error: "User not found" });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/user/profile", authenticateToken, (req: any, res) => {
  try {
    const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(req.user.id);
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_scans,
        SUM(CASE WHEN bin_type = 'Degradable' THEN 1 ELSE 0 END) as degradable_count
      FROM scans WHERE user_id = ?
    `).get(req.user.id);
    
    res.json({ user, stats });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/scans", authenticateToken, (req: any, res) => {
  try {
    const { item_type, confidence, bin_type } = req.body;
    const insert = db.prepare("INSERT INTO scans (user_id, item_type, confidence, bin_type) VALUES (?, ?, ?, ?)");
    const info = insert.run(req.user.id, item_type, confidence, bin_type);
    
    // Update bin fill level
    const updateBin = db.prepare("UPDATE bins SET fill_level = MIN(fill_level + 5, 100), last_updated = CURRENT_TIMESTAMP WHERE type = ?");
    updateBin.run(bin_type);
    
    // Update bin status based on fill level
    db.exec(`
      UPDATE bins 
      SET status = CASE 
        WHEN fill_level >= 90 THEN 'full'
        WHEN fill_level >= 75 THEN 'warning'
        ELSE 'normal'
      END
    `);
    
    res.json({ id: info.lastInsertRowid, success: true });
  } catch (error: any) {
    console.error("Error saving scan:", error);
    res.status(500).json({ error: "Failed to save scan" });
  }
});

app.get("/api/scans/history", authenticateToken, (req: any, res) => {
  try {
    const scans = db.prepare("SELECT * FROM scans WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(req.user.id);
    res.json(scans);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.get("/api/analytics", authenticateToken, (req: any, res) => {
  try {
    const typeDistribution = db.prepare(`
      SELECT bin_type as name, COUNT(*) as value 
      FROM scans 
      WHERE user_id = ? 
      GROUP BY bin_type
    `).all(req.user.id);
    
    const recentActivity = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count 
      FROM scans 
      WHERE user_id = ? 
      GROUP BY date(created_at) 
      ORDER BY date DESC LIMIT 7
    `).all(req.user.id);
    
    res.json({ typeDistribution, recentActivity: recentActivity.reverse() });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

app.get("/api/bins", authenticateToken, (req, res) => {
  try {
    const bins = db.prepare("SELECT * FROM bins").all();
    res.json(bins);
  } catch (error) {
    console.error("Error fetching bins:", error);
    res.status(500).json({ error: "Failed to fetch bins" });
  }
});

app.post("/api/bins/empty", authenticateToken, (req, res) => {
  try {
    const { type } = req.body;
    const update = db.prepare("UPDATE bins SET fill_level = 0, status = 'normal', last_updated = CURRENT_TIMESTAMP WHERE type = ?");
    update.run(type);
    res.json({ success: true });
  } catch (error) {
    console.error("Error emptying bin:", error);
    res.status(500).json({ error: "Failed to empty bin" });
  }
});

app.post("/api/classify-waste", authenticateToken, async (req, res) => {
  try {
    const response = await fetch("http://localhost:8000/api/classify-waste", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error proxying to FastAPI:", error);
    res.status(500).json({ error: "Failed to classify waste" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
