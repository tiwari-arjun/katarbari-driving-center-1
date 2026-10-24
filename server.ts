import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// Explicit technical SEO endpoints
app.get('/robots.txt', (_req: Request, res: Response) => {
  const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(robotsPath);
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(sitemapPath);
  } else {
    res.status(404).send('Not found');
  }
});

// Persistent database storage path
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStructure {
  admins: Array<{
    id: string;
    username: string;
    email: string;
    name: string;
    passwordHash: string;
    salt: string;
    role: string;
    createdAt: string;
  }>;
  sessions: Record<string, { adminId: string; username: string; email: string; role: string; expiresAt: number }>;
  students: Array<{
    id: string;
    fullName: string;
    phone: string;
    category: string;
    shift: string;
    notes: string;
    status: 'Pending' | 'Confirmed' | 'In Training' | 'Completed' | 'Cancelled';
    paymentStatus: 'Pending' | 'Partial' | 'Paid';
    createdAt: string;
  }>;
  enquiries: Array<{
    id: string;
    fullName: string;
    phone: string;
    course: string;
    message: string;
    status: 'New' | 'Contacted' | 'Enrolled' | 'Resolved';
    createdAt: string;
    adminNotes?: string;
  }>;
  courses: Array<{
    id: string;
    vehicleType: string;
    nameEn: string;
    nameNe: string;
    price: string;
    priceNumeric: number;
    duration: string;
    descriptionEn: string;
    descriptionNe: string;
    active: boolean;
  }>;
  analytics: {
    totalWrittenAttempts: number;
    totalEyeTestAttempts: number;
    passedWrittenAttempts: number;
    recentScores: Array<{ testType: string; score: number; total: number; timestamp: string }>;
  };
}

// Initial course specifications: Scooter 6,000, Motorbike 8,000, Car 12,000
const initialCourses = [
  {
    id: "scooter-course",
    vehicleType: "scooter",
    nameEn: "Scooter Training",
    nameNe: "स्कुटर तालिम",
    price: "रु. ६,०००",
    priceNumeric: 6000,
    duration: "15 Days Package",
    descriptionEn: "Learn scooter riding from the basics, balance, controls, turning, braking, and road safety.",
    descriptionNe: "स्कुटरको आधारभूत सीप, सन्तुलन, नियन्त्रण, मोड्ने तरिका, ब्रेक र सुरक्षित सडक अभ्यास।",
    active: true
  },
  {
    id: "motorbike-course",
    vehicleType: "motorbike",
    nameEn: "Motorbike Training",
    nameNe: "मोटरसाइकल तालिम",
    price: "रु. ८,०००",
    priceNumeric: 8000,
    duration: "21 Days Package",
    descriptionEn: "Motorcycle handling, clutch control, gear shifting, turning, and road awareness.",
    descriptionNe: "मोटरसाइकल नियन्त्रण, क्लचको प्रयोग, गियर परिवर्तन र सडक सचेतना।",
    active: true
  },
  {
    id: "car-course",
    vehicleType: "car",
    nameEn: "Car Driving Training",
    nameNe: "कार ड्राइभिङ तालिम",
    price: "रु. १२,०००",
    priceNumeric: 12000,
    duration: "30 Days Comprehensive",
    descriptionEn: "Essential car driving skills, steering, braking, parking, ramp climbing, and highway driving.",
    descriptionNe: "कार चलाउने आधारभूत सीप, स्टेयरिङ, पार्किङ, र्याम्प उठाउने र सडक अभ्यास।",
    active: true
  }
];

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function loadDB(): DBStructure {
  if (!fs.existsSync(DB_FILE)) {
    const initialSalt = crypto.randomBytes(16).toString('hex');
    const initialHash = hashPassword('Katarbari@2026', initialSalt);

    const defaultDB: DBStructure = {
      admins: [
        {
          id: 'admin-1',
          username: 'admin',
          email: 'admin@katarbari.com',
          name: 'Katarbari Administrator',
          passwordHash: initialHash,
          salt: initialSalt,
          role: 'SuperAdmin',
          createdAt: new Date().toISOString()
        }
      ],
      sessions: {},
      students: [
        {
          id: 'STU-101',
          fullName: 'Bikash Shrestha',
          phone: '9856012345',
          category: 'Category B (Car / Jeep)',
          shift: 'Morning (6:00 AM - 10:00 AM)',
          notes: 'Trial preparation for Pokhara DoTM',
          status: 'In Training',
          paymentStatus: 'Paid',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'STU-102',
          fullName: 'Sita Gurung',
          phone: '9846098765',
          category: 'Category K (Scooter)',
          shift: 'Evening (3:00 PM - 6:00 PM)',
          notes: 'Beginner learner from Waling Bazar',
          status: 'Confirmed',
          paymentStatus: 'Partial',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: 'STU-103',
          fullName: 'Ramesh Thapa',
          phone: '9806543210',
          category: 'Category A (Motorcycle)',
          shift: 'Day (11:00 AM - 3:00 PM)',
          notes: 'Figure 8 balance & uphill ramp practice',
          status: 'Pending',
          paymentStatus: 'Pending',
          createdAt: new Date().toISOString()
        }
      ],
      enquiries: [
        {
          id: 'ENQ-01',
          fullName: 'Dipak Thapa',
          phone: '9806511223',
          course: 'Motorbike Training',
          message: 'Interested in early morning 6 AM batch before office',
          status: 'New',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ENQ-02',
          fullName: 'Anjali Sharma',
          phone: '9812345678',
          course: 'Car Driving Training',
          message: 'Wants weekend refresher course',
          status: 'Contacted',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        }
      ],
      courses: initialCourses,
      analytics: {
        totalWrittenAttempts: 64,
        totalEyeTestAttempts: 41,
        passedWrittenAttempts: 56,
        recentScores: []
      }
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf-8');
    return defaultDB;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure Car price is updated to Rs. 12,000 if old seed was present
    if (parsed.courses) {
      const carCourse = parsed.courses.find((c: any) => c.id === 'car-course');
      if (carCourse && (carCourse.price === 'रु. १,२०,०००' || carCourse.priceNumeric > 20000)) {
        carCourse.price = 'रु. १२,०००';
        carCourse.priceNumeric = 12000;
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }
    }

    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return {
      admins: [],
      sessions: {},
      students: [],
      enquiries: [],
      courses: initialCourses,
      analytics: { totalWrittenAttempts: 0, totalEyeTestAttempts: 0, passedWrittenAttempts: 0, recentScores: [] }
    };
  }
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Authentication Middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const db = loadDB();
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    saveDB(db);
    return res.status(401).json({ error: 'Unauthorized: Session expired. Please log in again.' });
  }

  (req as any).adminUser = session;
  next();
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Check Admin Setup Status
app.get('/api/admin/setup-status', (req: Request, res: Response) => {
  const db = loadDB();
  res.json({
    hasAdmin: db.admins.length > 0,
    totalAdmins: db.admins.length
  });
});

// 2. Admin Login (Accepts username or email)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const identifier = (req.body.username || req.body.email || '').trim().toLowerCase();
  const password = req.body.password;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  const db = loadDB();
  const admin = db.admins.find(a => 
    a.username.toLowerCase() === identifier || 
    (a.email && a.email.toLowerCase() === identifier) ||
    (identifier === 'admin@katarbari.com' && a.username === 'admin')
  );

  if (!admin) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const computedHash = hashPassword(password, admin.salt);
  if (!crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(admin.passwordHash, 'hex'))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate secure 32-byte session token
  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

  db.sessions[token] = {
    adminId: admin.id,
    username: admin.username,
    email: admin.email || 'admin@katarbari.com',
    role: admin.role,
    expiresAt: Date.now() + sessionDuration
  };

  saveDB(db);

  const adminProfile = {
    id: admin.id,
    username: admin.username,
    email: admin.email || 'admin@katarbari.com',
    name: admin.name || 'Katarbari Administrator',
    role: admin.role
  };

  res.json({
    success: true,
    token,
    admin: adminProfile,
    user: adminProfile
  });
});

// 3. Admin Session Verification
const handleSessionCheck = (req: Request, res: Response) => {
  const session = (req as any).adminUser;
  res.json({
    valid: true,
    authenticated: true,
    admin: {
      id: session.adminId,
      username: session.username,
      email: session.email || 'admin@katarbari.com',
      name: 'Katarbari Administrator',
      role: session.role
    },
    user: {
      username: session.username,
      role: session.role
    }
  });
};

app.get('/api/admin/session', authenticateAdmin, handleSessionCheck);
app.get('/api/admin/me', authenticateAdmin, handleSessionCheck);

// 4. Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const db = loadDB();
    if (db.sessions[token]) {
      delete db.sessions[token];
      saveDB(db);
    }
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// 5. Admin Overview / Stats
const handleOverviewStats = (req: Request, res: Response) => {
  const db = loadDB();

  const totalStudents = db.students.length;
  const newEnquiries = db.enquiries.filter(e => e.status === 'New').length;
  const activeCourses = db.courses.filter(c => c.active).length;

  const courseCounts: Record<string, number> = {};
  let totalRevenue = 0;

  db.students.forEach(s => {
    courseCounts[s.category] = (courseCounts[s.category] || 0) + 1;
    if (s.paymentStatus === 'Paid') {
      if (s.category.includes('Car')) totalRevenue += 12000;
      else if (s.category.includes('Motorcycle')) totalRevenue += 8000;
      else if (s.category.includes('Scooter')) totalRevenue += 6000;
    }
  });

  const paymentStats = {
    paid: db.students.filter(s => s.paymentStatus === 'Paid').length,
    partial: db.students.filter(s => s.paymentStatus === 'Partial').length,
    pending: db.students.filter(s => s.paymentStatus === 'Pending').length
  };

  res.json({
    totalStudents,
    newEnquiries,
    activeCourses,
    totalRevenue,
    courseCounts,
    paymentStats,
    recentStudents: db.students.slice(-5).reverse(),
    recentEnquiries: db.enquiries.slice(-5).reverse(),
    analytics: db.analytics
  });
};

app.get('/api/admin/overview', authenticateAdmin, handleOverviewStats);
app.get('/api/admin/stats', authenticateAdmin, handleOverviewStats);

// 6. Student Management Routes
app.get('/api/admin/students', authenticateAdmin, (req: Request, res: Response) => {
  const { search, q, course, status } = req.query;
  const db = loadDB();

  let results = [...db.students];
  const queryStr = (search || q || '') as string;

  if (queryStr) {
    const query = queryStr.toLowerCase();
    results = results.filter(s => 
      s.fullName.toLowerCase().includes(query) || 
      s.phone.includes(query) ||
      s.id.toLowerCase().includes(query)
    );
  }

  if (course && typeof course === 'string' && course !== 'all') {
    results = results.filter(s => s.category.toLowerCase().includes(course.toLowerCase()));
  }

  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }

  // Return raw array directly for Dashboard compatibility
  res.json(results.reverse());
});

app.patch('/api/admin/students/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, notes } = req.body;

  const db = loadDB();
  const index = db.students.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }

  if (status) db.students[index].status = status;
  if (paymentStatus) db.students[index].paymentStatus = paymentStatus;
  if (notes !== undefined) db.students[index].notes = notes;

  saveDB(db);
  res.json({ success: true, student: db.students[index] });
});

// CSV Export (Supports both /export and /export-csv)
const handleCsvExport = (req: Request, res: Response) => {
  const db = loadDB();
  const headers = ['ID', 'Full Name', 'Phone', 'Category', 'Shift', 'Status', 'Payment', 'Date'];
  const rows = db.students.map(s => [
    `"${s.id}"`,
    `"${s.fullName.replace(/"/g, '""')}"`,
    `"${s.phone}"`,
    `"${s.category.replace(/"/g, '""')}"`,
    `"${s.shift.replace(/"/g, '""')}"`,
    `"${s.status}"`,
    `"${s.paymentStatus}"`,
    `"${new Date(s.createdAt).toLocaleDateString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="katarbari_students.csv"');
  res.send(csvContent);
};

app.get('/api/admin/students/export', authenticateAdmin, handleCsvExport);
app.get('/api/admin/students/export-csv', authenticateAdmin, handleCsvExport);

// 7. Course Management Routes
app.get('/api/courses', (req: Request, res: Response) => {
  const db = loadDB();
  res.json({ courses: db.courses });
});

app.get('/api/admin/courses', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDB();
  res.json(db.courses);
});

app.put('/api/admin/courses/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { price, priceNumeric, descriptionEn, descriptionNe, active } = req.body;

  const db = loadDB();
  const index = db.courses.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (price !== undefined) db.courses[index].price = price;
  if (priceNumeric !== undefined) db.courses[index].priceNumeric = Number(priceNumeric);
  if (descriptionEn !== undefined) db.courses[index].descriptionEn = descriptionEn;
  if (descriptionNe !== undefined) db.courses[index].descriptionNe = descriptionNe;
  if (active !== undefined) db.courses[index].active = Boolean(active);

  saveDB(db);
  res.json({ success: true, course: db.courses[index] });
});

// 8. Enquiries Management
app.get('/api/admin/enquiries', authenticateAdmin, (req: Request, res: Response) => {
  const { status } = req.query;
  const db = loadDB();

  let results = [...db.enquiries];
  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }

  res.json(results.reverse());
});

app.patch('/api/admin/enquiries/:id', authenticateAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const db = loadDB();
  const index = db.enquiries.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  if (status) db.enquiries[index].status = status;
  if (adminNotes !== undefined) db.enquiries[index].adminNotes = adminNotes;

  saveDB(db);
  res.json({ success: true, enquiry: db.enquiries[index] });
});

// 9. Analytics Endpoint for Admin Dashboard
app.get('/api/admin/analytics', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDB();
  const writtenTotal = db.analytics.totalWrittenAttempts || 0;
  const writtenPassed = db.analytics.passedWrittenAttempts || 0;
  const passRate = writtenTotal > 0 ? Math.round((writtenPassed / writtenTotal) * 100) : 88;

  res.json({
    totalWrittenAttempts: writtenTotal,
    totalEyeTestAttempts: db.analytics.totalEyeTestAttempts || 0,
    passedWrittenAttempts: writtenPassed,
    passRate,
    commonMistakes: [
      { category: 'Traffic Signs & Regulations', missRate: '34%' },
      { category: 'Roundabout (गोलघुम्ती) Right of Way', missRate: '28%' },
      { category: 'Ramp Uphill Clutch Control', missRate: '22%' },
      { category: 'Over-speeding in Residential Zones', missRate: '16%' }
    ],
    recentScores: db.analytics.recentScores || []
  });
});

// 10. Admin Password Change Endpoint
app.post('/api/admin/password', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const session = (req as any).adminUser;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  const db = loadDB();
  const admin = db.admins.find(a => a.id === session.adminId);

  if (!admin) {
    return res.status(404).json({ error: 'Admin account not found' });
  }

  const computedCurrent = hashPassword(currentPassword, admin.salt);
  if (!crypto.timingSafeEqual(Buffer.from(computedCurrent, 'hex'), Buffer.from(admin.passwordHash, 'hex'))) {
    return res.status(400).json({ error: 'Current password does not match' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  admin.salt = newSalt;
  admin.passwordHash = hashPassword(newPassword, newSalt);

  saveDB(db);
  res.json({ success: true, message: 'Password updated successfully' });
});

// 11. Public Registration Endpoint
app.post('/api/register', (req: Request, res: Response) => {
  const { fullName, phone, category, shift, notes } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Full name and phone number are required.' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  const db = loadDB();
  const newId = `KDC-${Date.now().toString().slice(-6)}`;

  const newStudent = {
    id: newId,
    fullName: fullName.trim(),
    phone: cleanPhone,
    category: category || 'Category B (Car / Jeep)',
    shift: shift || 'Morning (6:00 AM - 10:00 AM)',
    notes: (notes || '').trim(),
    status: 'Pending' as const,
    paymentStatus: 'Pending' as const,
    createdAt: new Date().toISOString()
  };

  db.students.push(newStudent);
  saveDB(db);

  res.status(201).json({
    success: true,
    registrationId: newId,
    student: newStudent,
    message: 'Your enrollment has been successfully recorded in Katarbari Driving Center records.'
  });
});

// 12. Public Enquiry Submission Endpoint
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { fullName, phone, course, message } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Name and contact phone are required.' });
  }

  const db = loadDB();
  const newEnquiry = {
    id: `ENQ-${Date.now().toString().slice(-5)}`,
    fullName: fullName.trim(),
    phone: phone.trim(),
    course: course || 'General Inquiry',
    message: message || '',
    status: 'New' as const,
    createdAt: new Date().toISOString()
  };

  db.enquiries.push(newEnquiry);
  saveDB(db);

  res.status(201).json({
    success: true,
    enquiryId: newEnquiry.id,
    message: 'Thank you. Our administration office will contact you shortly.'
  });
});

// 13. Practice Test & Eye Test Analytics Logger
app.post('/api/analytics/test-attempt', (req: Request, res: Response) => {
  const { testType, score, total, passed } = req.body;
  const db = loadDB();

  if (testType === 'eye_test') {
    db.analytics.totalEyeTestAttempts = (db.analytics.totalEyeTestAttempts || 0) + 1;
  } else {
    db.analytics.totalWrittenAttempts = (db.analytics.totalWrittenAttempts || 0) + 1;
    if (passed) {
      db.analytics.passedWrittenAttempts = (db.analytics.passedWrittenAttempts || 0) + 1;
    }
  }

  if (score !== undefined) {
    db.analytics.recentScores = db.analytics.recentScores || [];
    db.analytics.recentScores.unshift({
      testType: testType || 'written',
      score: Number(score),
      total: Number(total || 20),
      timestamp: new Date().toISOString()
    });
    if (db.analytics.recentScores.length > 50) {
      db.analytics.recentScores = db.analytics.recentScores.slice(0, 50);
    }
  }

  saveDB(db);
  res.json({ success: true });
});

// ==========================================
// TECHNICAL SEO: ROBOTS.TXT & SITEMAP.XML
// ==========================================
app.get('/robots.txt', (_req: Request, res: Response) => {
  const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.type('text/plain').sendFile(robotsPath);
  } else {
    res.type('text/plain').send("User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /#admin\nSitemap: /sitemap.xml\n");
  }
});

app.get('/sitemap.xml', (_req: Request, res: Response) => {
  const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.type('application/xml').sendFile(sitemapPath);
  } else {
    res.status(404).send('Not Found');
  }
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================
async function startServer() {
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Katarbari Driving Center server running on http://localhost:${PORT}`);
  });
}

startServer();
