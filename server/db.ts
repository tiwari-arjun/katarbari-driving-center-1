import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface StudentRecord {
  id: string;
  fullName: string;
  phone: string;
  courseCategory: string;
  courseName: string;
  shift: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_training' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'partial';
  feeAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  courseInterest: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
  message?: string;
  status: 'new' | 'contacted' | 'enrolled' | 'resolved';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseConfigRecord {
  id: string;
  vehicleType: 'scooter' | 'motorbike' | 'car';
  nameEn: string;
  nameNe: string;
  priceEn: string;
  priceNe: string;
  priceValue: number;
  durationEn: string;
  durationNe: string;
  descriptionEn: string;
  descriptionNe: string;
  featuresEn: string[];
  featuresNe: string[];
  active: boolean;
  updatedAt: string;
}

export interface PracticeTestLog {
  id: string;
  testType: 'quick' | 'mock' | 'category' | 'randomized';
  category?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds?: number;
  missedQuestionIds?: string[];
  timestamp: string;
}

export interface EyeTestLog {
  id: string;
  testType: 'numbers' | 'sequence' | 'symbols';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'instructor';
  passwordHash: string;
  salt: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  token: string;
  adminId: string;
  email: string;
  role: string;
  expiresAt: number;
}

export interface DatabaseSchema {
  students: StudentRecord[];
  enquiries: EnquiryRecord[];
  courses: CourseConfigRecord[];
  practiceLogs: PracticeTestLog[];
  eyeTestLogs: EyeTestLog[];
  admins: AdminAccount[];
  sessions: AdminSession[];
}

// Data directory on server disk
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'katarbari_db.json');

// Helper to hash passwords securely using crypto PBKDF2
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initial course records adhering strictly to requested exact prices:
// Scooter: Rs. 6,000 / रु. ६,०००
// Motorbike: Rs. 8,000 / रु. ८,०००
// Car: Rs. 12,000 / रु. १२,०००
const INITIAL_COURSES: CourseConfigRecord[] = [
  {
    id: 'scooter-course',
    vehicleType: 'scooter',
    nameEn: 'Scooter Training',
    nameNe: 'स्कुटर तालिम',
    priceEn: 'Rs. 6,000',
    priceNe: 'रु. ६,०००',
    priceValue: 6000,
    durationEn: '15 Days Package',
    durationNe: '१५ दिने प्याकेज',
    descriptionEn: 'Learn scooter riding from the basics, including balance, controls, turning, braking, and safe road practices.',
    descriptionNe: 'स्कुटरको आधारभूत सीप, सन्तुलन, नियन्त्रण, मोड्ने तरिका, ब्रेक लगाउने सीप र सुरक्षित सडक प्रयोग गर्न सिक्नुहोस्।',
    featuresEn: ['Beginner-friendly training', 'Practical riding sessions', 'Road safety fundamentals'],
    featuresNe: ['सुरुवाती सिक्नेहरूका लागि उपयुक्त', 'व्याहारिक सवारी अभ्यास', 'सडक सुरक्षाको आधारभूत ज्ञान'],
    active: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'motorbike-course',
    vehicleType: 'motorbike',
    nameEn: 'Motorbike Training',
    nameNe: 'मोटरसाइकल तालिम',
    priceEn: 'Rs. 8,000',
    priceNe: 'रु. ८,०००',
    priceValue: 8000,
    durationEn: '21 Days Package',
    durationNe: '२१ दिने प्याकेज',
    descriptionEn: 'Build confidence in motorcycle handling, gear shifting, clutch control, braking, turning, and road awareness.',
    descriptionNe: 'मोटरसाइकल नियन्त्रण, गियर परिवर्तन, क्लचको प्रयोग, ब्रेकिङ, मोड्ने तरिका र सडक सचेतनाको अभ्यास गर्नुहोस्।',
    featuresEn: ['Clutch and gear control', 'Turning and braking practice', 'Safe riding techniques'],
    featuresNe: ['क्लच र गियर नियन्त्रण', 'मोड्ने र ब्रेक लगाउने अभ्यास', 'सुरक्षित सवारी चलाउने सीप'],
    active: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'car-course',
    vehicleType: 'car',
    nameEn: 'Car Driving Training',
    nameNe: 'कार ड्राइभिङ तालिम',
    priceEn: 'Rs. 12,000',
    priceNe: 'रु. १२,०००',
    priceValue: 12000,
    durationEn: '30 Days Comprehensive',
    durationNe: '३० दिने पूर्ण तालिम',
    descriptionEn: 'Learn essential car driving skills, steering control, acceleration, braking, parking, traffic rules, and practical road awareness.',
    descriptionNe: 'कार चलाउने आधारभूत सीप, स्टेयरिङ नियन्त्रण, एक्सेलेरेटर, ब्रेक, पार्किङ, ट्राफिक नियम र सडकमा सवारी चलाउने अभ्यास गर्नुहोस्।',
    featuresEn: ['Beginner driving lessons', 'Steering and parking practice', 'Traffic rules and road awareness'],
    featuresNe: ['सुरुवाती ड्राइभिङ तालिम', 'स्टेयरिङ र पार्किङ अभ्यास', 'ट्राफिक नियम र सडक सचेतना'],
    active: true,
    updatedAt: new Date().toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadDatabase();
    this.seedDefaultAdmin();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all arrays exist
        return {
          students: parsed.students || [],
          enquiries: parsed.enquiries || [],
          courses: parsed.courses && parsed.courses.length > 0 ? parsed.courses : INITIAL_COURSES,
          practiceLogs: parsed.practiceLogs || [],
          eyeTestLogs: parsed.eyeTestLogs || [],
          admins: parsed.admins || [],
          sessions: parsed.sessions || []
        };
      } catch (e) {
        console.error('Error reading db file, reinitializing', e);
      }
    }

    // Default Seed
    const initial: DatabaseSchema = {
      students: [
        {
          id: 'STU-' + Date.now().toString().slice(-6),
          fullName: 'Bikash Adhikari',
          phone: '9856012345',
          courseCategory: 'Category B (Car / Jeep)',
          courseName: 'Car Driving Training',
          shift: 'Morning (6:00 AM - 10:00 AM)',
          notes: 'Trial preparation for Pokhara DOTM test',
          status: 'confirmed',
          paymentStatus: 'completed',
          feeAmount: 12000,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'STU-' + (Date.now() - 5000).toString().slice(-6),
          fullName: 'Sita Gurung',
          phone: '9846098765',
          courseCategory: 'Category K (Scooter)',
          courseName: 'Scooter Training',
          shift: 'Evening (3:00 PM - 6:00 PM)',
          notes: 'Beginner student from Waling-1',
          status: 'in_training',
          paymentStatus: 'completed',
          feeAmount: 6000,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: 'STU-' + (Date.now() - 9000).toString().slice(-6),
          fullName: 'Kiran Thapa',
          phone: '9812345678',
          courseCategory: 'Category A (Motorcycle)',
          courseName: 'Motorbike Training',
          shift: 'Morning (6:00 AM - 10:00 AM)',
          notes: '8-turn special practice needed',
          status: 'pending',
          paymentStatus: 'pending',
          feeAmount: 8000,
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ],
      enquiries: [
        {
          id: 'ENQ-101',
          fullName: 'Ramesh Sharma',
          phone: '9867011223',
          courseInterest: 'Category B (Car / Jeep)',
          preferredContact: 'phone',
          message: 'Interested in early morning 6 AM car driving batch for next month.',
          status: 'new',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: 'ENQ-102',
          fullName: 'Anisha Rana',
          phone: '9801234567',
          courseInterest: 'Category K (Scooter)',
          preferredContact: 'whatsapp',
          message: 'Can I pay in two installments?',
          status: 'contacted',
          notes: 'Called and confirmed installment plan',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      courses: INITIAL_COURSES,
      practiceLogs: [
        {
          id: 'LOG-1',
          testType: 'mock',
          score: 18,
          totalQuestions: 20,
          percentage: 90,
          isPassed: true,
          timeSpentSeconds: 320,
          missedQuestionIds: ['q005', 'q012'],
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'LOG-2',
          testType: 'quick',
          score: 14,
          totalQuestions: 20,
          percentage: 70,
          isPassed: true,
          timeSpentSeconds: 260,
          missedQuestionIds: ['q002', 'q004', 'q008', 'q010', 'q011', 'q012'],
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
        }
      ],
      eyeTestLogs: [
        {
          id: 'EYE-1',
          testType: 'numbers',
          difficulty: 'medium',
          score: 9,
          totalQuestions: 10,
          percentage: 90,
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      admins: [],
      sessions: []
    };

    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave = this.data) {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (e) {
      console.error('Failed to atomically write DB file', e);
    }
  }

  private seedDefaultAdmin() {
    // If no admin exists, create authorized administrator
    if (this.data.admins.length === 0) {
      const defaultSalt = generateSalt();
      const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Katarbari@Waling2026';
      const defaultAdmin: AdminAccount = {
        id: 'admin-primary',
        email: 'admin@katarbari.com',
        name: 'Katarbari Driving Center Admin',
        role: 'super_admin',
        salt: defaultSalt,
        passwordHash: hashPassword(defaultPassword, defaultSalt),
        createdAt: new Date().toISOString()
      };
      this.data.admins.push(defaultAdmin);
      this.saveDatabase();
      console.log('✅ Initialized primary admin account: admin@katarbari.com');
    }
  }

  // --- Student Methods ---
  public getStudents(search?: string, courseFilter?: string, statusFilter?: string): StudentRecord[] {
    let result = [...this.data.students];
    if (courseFilter && courseFilter !== 'all') {
      result = result.filter(s => s.courseCategory.toLowerCase().includes(courseFilter.toLowerCase()) || s.courseName.toLowerCase().includes(courseFilter.toLowerCase()));
    }
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(s => 
        s.fullName.toLowerCase().includes(term) || 
        s.phone.includes(term) ||
        s.id.toLowerCase().includes(term)
      );
    }
    // Return newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addStudent(data: Omit<StudentRecord, 'id' | 'createdAt' | 'updatedAt'>): StudentRecord {
    const newStudent: StudentRecord = {
      ...data,
      id: 'KDC-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.students.unshift(newStudent);
    this.saveDatabase();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<StudentRecord>): StudentRecord | null {
    const idx = this.data.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.students[idx] = {
      ...this.data.students[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.students[idx];
  }

  // --- Enquiry Methods ---
  public getEnquiries(statusFilter?: string): EnquiryRecord[] {
    let result = [...this.data.enquiries];
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(e => e.status === statusFilter);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addEnquiry(data: Omit<EnquiryRecord, 'id' | 'createdAt' | 'updatedAt'>): EnquiryRecord {
    const newEnquiry: EnquiryRecord = {
      ...data,
      id: 'ENQ-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnquiry);
    this.saveDatabase();
    return newEnquiry;
  }

  public updateEnquiry(id: string, updates: Partial<EnquiryRecord>): EnquiryRecord | null {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx] = {
      ...this.data.enquiries[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.enquiries[idx];
  }

  // --- Course Config Methods ---
  public getCourses(): CourseConfigRecord[] {
    return [...this.data.courses];
  }

  public updateCourse(id: string, updates: Partial<CourseConfigRecord>): CourseConfigRecord | null {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.courses[idx] = {
      ...this.data.courses[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.courses[idx];
  }

  // --- Analytics Logs ---
  public logPracticeTest(log: Omit<PracticeTestLog, 'id' | 'timestamp'>): PracticeTestLog {
    const newLog: PracticeTestLog = {
      ...log,
      id: 'PRAC-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString()
    };
    this.data.practiceLogs.unshift(newLog);
    // Keep max 200 logs
    if (this.data.practiceLogs.length > 200) {
      this.data.practiceLogs.length = 200;
    }
    this.saveDatabase();
    return newLog;
  }

  public logEyeTest(log: Omit<EyeTestLog, 'id' | 'timestamp'>): EyeTestLog {
    const newLog: EyeTestLog = {
      ...log,
      id: 'EYE-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString()
    };
    this.data.eyeTestLogs.unshift(newLog);
    if (this.data.eyeTestLogs.length > 200) {
      this.data.eyeTestLogs.length = 200;
    }
    this.saveDatabase();
    return newLog;
  }

  public getPracticeAnalytics() {
    const logs = this.data.practiceLogs;
    const totalAttempts = logs.length;
    const totalPassed = logs.filter(l => l.isPassed).length;
    const avgScore = totalAttempts > 0 
      ? Math.round(logs.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts) 
      : 0;
    
    // Calculate most missed question IDs
    const missedMap: Record<string, number> = {};
    logs.forEach(l => {
      if (l.missedQuestionIds) {
        l.missedQuestionIds.forEach(qId => {
          missedMap[qId] = (missedMap[qId] || 0) + 1;
        });
      }
    });

    const mostMissedQuestions = Object.entries(missedMap)
      .map(([questionId, count]) => ({ questionId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const eyeLogs = this.data.eyeTestLogs;
    const eyeAttempts = eyeLogs.length;
    const eyeAvgScore = eyeAttempts > 0 
      ? Math.round(eyeLogs.reduce((acc, curr) => acc + curr.percentage, 0) / eyeAttempts)
      : 0;

    return {
      totalAttempts,
      totalPassed,
      passRate: totalAttempts > 0 ? Math.round((totalPassed / totalAttempts) * 100) : 0,
      avgScore,
      mostMissedQuestions,
      recentAttempts: logs.slice(0, 10),
      eyeTestStats: {
        totalAttempts: eyeAttempts,
        avgScore: eyeAvgScore,
        recentAttempts: eyeLogs.slice(0, 10)
      }
    };
  }

  // --- Authentication & Session Methods ---
  public findAdminByEmail(email: string): AdminAccount | undefined {
    return this.data.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  public createSession(admin: AdminAccount): AdminSession {
    const token = generateToken();
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
    const session: AdminSession = {
      token,
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
      expiresAt
    };

    // Update lastLogin on admin
    const idx = this.data.admins.findIndex(a => a.id === admin.id);
    if (idx !== -1) {
      this.data.admins[idx].lastLogin = new Date().toISOString();
    }

    this.data.sessions.push(session);
    this.saveDatabase();
    return session;
  }

  public verifySession(token: string): AdminAccount | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    return this.data.admins.find(a => a.id === session.adminId) || null;
  }

  public revokeSession(token: string): boolean {
    const initialLen = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    if (this.data.sessions.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  public changeAdminPassword(adminId: string, newPassword: string): boolean {
    const idx = this.data.admins.findIndex(a => a.id === adminId);
    if (idx === -1) return false;
    const salt = generateSalt();
    this.data.admins[idx].salt = salt;
    this.data.admins[idx].passwordHash = hashPassword(newPassword, salt);
    this.saveDatabase();
    return true;
  }

  public getDashboardOverview() {
    const students = this.data.students;
    const enquiries = this.data.enquiries;
    const courses = this.data.courses;

    const totalStudents = students.length;
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter(e => e.status === 'new').length;

    // Course breakdown
    const courseStats: Record<string, { count: number; name: string; revenue: number }> = {};
    courses.forEach(c => {
      courseStats[c.id] = { count: 0, name: c.nameEn, revenue: 0 };
    });

    students.forEach(s => {
      const match = courses.find(c => s.courseCategory.toLowerCase().includes(c.vehicleType) || s.courseName.toLowerCase().includes(c.vehicleType));
      const key = match ? match.id : 'other';
      if (!courseStats[key]) {
        courseStats[key] = { count: 0, name: s.courseName || 'Other', revenue: 0 };
      }
      courseStats[key].count += 1;
      if (s.paymentStatus === 'completed') {
        courseStats[key].revenue += s.feeAmount || 0;
      }
    });

    // Payment stats
    const totalRevenue = students.filter(s => s.paymentStatus === 'completed').reduce((sum, s) => sum + (s.feeAmount || 0), 0);
    const pendingPayments = students.filter(s => s.paymentStatus === 'pending').length;
    const completedPayments = students.filter(s => s.paymentStatus === 'completed').length;

    return {
      totalStudents,
      totalEnquiries,
      newEnquiries,
      totalRevenue,
      pendingPayments,
      completedPayments,
      courseStats,
      recentStudents: students.slice(0, 5),
      recentEnquiries: enquiries.slice(0, 5)
    };
  }
}

export const db = new Database();
