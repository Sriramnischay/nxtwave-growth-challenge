import fs from 'fs';
import path from 'path';
import { Student, Referral, AdminStats, LeaderboardEntry, DailyTrend, CollegeStat, BranchStat } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  students: Student[];
  referrals: Referral[];
  config: {
    targetRegistrations: number;
    budgetTotal: number;
    campaignStartDate: string;
    campaignEndDate: string;
  };
}

// Generate unique 5-char alphanumeric code: NXT-XXXXX
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing chars like O, 0, 1, I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `NXT-${code}`;
}

const SEED_STUDENTS_BASE = [
  { name: "Karthik Reddy", email: "karthik.reddy@gmail.com", college: "JNTU Hyderabad", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 5, refCount: 12 },
  { name: "Ananya Iyer", email: "ananya.iyer@nitk.edu.in", college: "NIT Surathkal", branch: "Artificial Intelligence & Data Science (AI & DS)", grad: "2025", daysAgo: 5, refCount: 9 },
  { name: "Rohit Verma", email: "rohit.verma@iitm.ac.in", college: "IIT Madras", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 4, refCount: 8 },
  { name: "Sneha Patel", email: "sneha.patel@vit.ac.in", college: "VIT Vellore", branch: "Information Technology (IT)", grad: "2026", daysAgo: 4, refCount: 7 },
  { name: "Aditya Menon", email: "aditya.menon@bits-pilani.ac.in", college: "BITS Pilani", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 4, refCount: 6 },
  { name: "Pooja Deshmukh", email: "pooja.deshmukh@coep.ac.in", college: "COEP Technological University, Pune", branch: "Electronics & Communication Engineering (ECE)", grad: "2025", daysAgo: 3, refCount: 6 },
  { name: "Sai Teja", email: "sai.teja@cbit.ac.in", college: "Chaitanya Bharathi Institute of Technology (CBIT)", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 3, refCount: 5 },
  { name: "Vikram Rao", email: "vikram.rao@rvce.edu.in", college: "RV College of Engineering, Bengaluru", branch: "Information Technology (IT)", grad: "2026", daysAgo: 3, refCount: 4 },
  { name: "Divya Krishnan", email: "divya.k@annauniv.edu", college: "Anna University, Chennai", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 3, refCount: 4 },
  { name: "Rahul Sharma", email: "rahul.sharma@dtu.ac.in", college: "Delhi Technological University (DTU)", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 2, refCount: 4 },
  { name: "Nikhil Joshi", email: "nikhil.joshi@psgtech.ac.in", college: "PSG College of Technology, Coimbatore", branch: "Artificial Intelligence & Data Science (AI & DS)", grad: "2025", daysAgo: 2, refCount: 3 },
  { name: "Meera Nambiar", email: "meera.n@amrita.edu", college: "Amrita Vishwa Vidyapeetham", branch: "Electronics & Communication Engineering (ECE)", grad: "2026", daysAgo: 2, refCount: 3 },
  { name: "Varun Nair", email: "varun.nair@srmuniv.ac.in", college: "SRM Institute of Science & Technology", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 2, refCount: 3 },
  { name: "Swathi Sundaram", email: "swathi.s@nitt.edu", college: "NIT Trichy", branch: "Computer Science & Engineering (CSE)", grad: "2025", daysAgo: 1, refCount: 2 },
  { name: "Abhishek Bannerjee", email: "abhishek.b@thapar.edu", college: "Thapar Institute of Engineering & Technology", branch: "Information Technology (IT)", grad: "2025", daysAgo: 1, refCount: 2 },
  { name: "Harshitha G", email: "harshitha.g@vnr.ac.in", college: "VNR Vignana Jyothi Institute", branch: "Computer Science & Engineering (CSE)", grad: "2026", daysAgo: 1, refCount: 2 },
];

const FIRST_NAMES = ["Aryan", "Tanvi", "Siddharth", "Aishwarya", "Deepak", "Riya", "Manoj", "Kavya", "Pranav", "Bhavana", "Gautam", "Shruti", "Akash", "Nidhi", "Suresh", "Priyanka", "Harish", "Aravind", "Gayatri", "Vishal", "Sowmya", "Kiran", "Tarun", "Shreya", "Naveen", "Archana", "Arjun", "Neha", "Raghav", "Soundarya"];
const LAST_NAMES = ["Gupta", "Rao", "Kumar", "Singh", "Das", "Choudhury", "Bose", "Hegde", "Reddy", "Murthy", "Shenoy", "Bhat", "Mishra", "Pandey", "Chatterjee", "Kulkarni", "Patil", "Agarwal", "Bansal", "Shah"];
const COLLEGES_POOL = [
  "IIT Madras", "NIT Trichy", "NIT Surathkal", "BITS Pilani", "VIT Vellore",
  "SRM Institute of Science & Technology", "JNTU Hyderabad", "Anna University, Chennai",
  "RV College of Engineering, Bengaluru", "PSG College of Technology, Coimbatore",
  "Delhi Technological University (DTU)", "Thapar Institute of Engineering & Technology",
  "Chaitanya Bharathi Institute of Technology (CBIT)", "VNR Vignana Jyothi Institute",
  "COEP Technological University, Pune", "PES University, Bengaluru", "Manipal Institute of Technology"
];
const BRANCHES_POOL = [
  "Computer Science & Engineering (CSE)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Information Technology (IT)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering (ME)"
];

function generateSeedData(): DatabaseSchema {
  const students: Student[] = [];
  const referrals: Referral[] = [];
  const now = Date.now();

  // Create top influencers/seed referrers
  SEED_STUDENTS_BASE.forEach((seed, idx) => {
    const code = `NXT-${(10000 + idx * 73 + 12).toString(36).toUpperCase()}`.slice(0, 9);
    const createdAt = new Date(now - seed.daysAgo * 86400000 + idx * 3600000).toISOString();
    
    students.push({
      id: `std-seed-${idx + 1}`,
      name: seed.name,
      email: seed.email,
      college: seed.college,
      branch: seed.branch,
      graduationYear: seed.grad,
      referralCode: code,
      referredBy: null,
      referralCount: seed.refCount,
      createdAt,
      isDemo: true,
    });
  });

  // Now create the referred students to match their referral counts exactly
  let referredStudentCounter = 1;
  students.forEach((referrer) => {
    const countToGenerate = referrer.referralCount;
    for (let i = 0; i < countToGenerate; i++) {
      const fName = FIRST_NAMES[(referredStudentCounter * 7 + i) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(referredStudentCounter * 11 + i) % LAST_NAMES.length];
      const fullName = `${fName} ${lName}`;
      const college = Math.random() > 0.4 ? referrer.college : COLLEGES_POOL[(referredStudentCounter * 3) % COLLEGES_POOL.length];
      const branch = BRANCHES_POOL[(referredStudentCounter * 2 + i) % BRANCHES_POOL.length];
      const refId = `std-seed-ref-${referredStudentCounter}`;
      const myRefCode = generateReferralCode();
      const refCreatedAt = new Date(new Date(referrer.createdAt).getTime() + (i + 1) * (4 * 3600000) + (i * 1234567) % 7200000).toISOString();
      
      const newStudent: Student = {
        id: refId,
        name: fullName,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${referredStudentCounter}@${college.toLowerCase().includes('iit') ? 'iit.ac.in' : 'gmail.com'}`,
        college,
        branch,
        graduationYear: Math.random() > 0.25 ? "2025" : "2026",
        referralCode: myRefCode,
        referredBy: referrer.referralCode,
        referralCount: 0,
        createdAt: refCreatedAt,
        isDemo: true,
      };

      students.push(newStudent);

      referrals.push({
        id: `ref-seed-${referredStudentCounter}`,
        referrerId: referrer.id,
        referrerCode: referrer.referralCode,
        referredStudentId: newStudent.id,
        referredStudentName: newStudent.name,
        referredStudentCollege: newStudent.college,
        createdAt: refCreatedAt,
      });

      referredStudentCounter++;
    }
  });

  // Add ~150 direct organic registrations across days to reach ~328 realistic registrations
  const totalDirectToCreate = 145;
  for (let d = 0; d < totalDirectToCreate; d++) {
    const fName = FIRST_NAMES[(d * 13 + 3) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(d * 17 + 5) % LAST_NAMES.length];
    const daysAgo = Math.floor(Math.random() * 5);
    const createdAt = new Date(now - daysAgo * 86400000 - Math.random() * 43200000).toISOString();
    const college = COLLEGES_POOL[d % COLLEGES_POOL.length];
    const branch = BRANCHES_POOL[d % BRANCHES_POOL.length];
    
    students.push({
      id: `std-seed-direct-${d + 1}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${d + 100}@student.edu`,
      college,
      branch,
      graduationYear: d % 5 === 0 ? "2026" : "2025",
      referralCode: generateReferralCode(),
      referredBy: null,
      referralCount: 0,
      createdAt,
      isDemo: true,
    });
  }

  return {
    students,
    referrals,
    config: {
      targetRegistrations: 500,
      budgetTotal: 2000,
      campaignStartDate: new Date(now - 5 * 86400000).toISOString(),
      campaignEndDate: new Date(now + 2 * 86400000).toISOString(),
    }
  };
}

function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const seedData = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
    return seedData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!parsed.students || !parsed.referrals) {
      const seedData = generateSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
      return seedData;
    }
    return parsed;
  } catch {
    const seedData = generateSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), 'utf-8');
    return seedData;
  }
}

function saveDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Public Database API
export const db = {
  getStudents(): Student[] {
    const data = ensureDbExists();
    return data.students;
  },

  getStudentByEmail(email: string): Student | undefined {
    const data = ensureDbExists();
    const cleanEmail = email.trim().toLowerCase();
    return data.students.find(s => s.email.toLowerCase() === cleanEmail);
  },

  getStudentByReferralCode(code: string): Student | undefined {
    const data = ensureDbExists();
    const cleanCode = code.trim().toUpperCase();
    return data.students.find(s => s.referralCode.toUpperCase() === cleanCode);
  },

  getStudentById(id: string): Student | undefined {
    const data = ensureDbExists();
    return data.students.find(s => s.id === id);
  },

  getReferralsByReferrerId(referrerId: string): Referral[] {
    const data = ensureDbExists();
    return data.referrals.filter(r => r.referrerId === referrerId);
  },

  getReferralsByReferrerCode(code: string): Referral[] {
    const data = ensureDbExists();
    const cleanCode = code.trim().toUpperCase();
    return data.referrals.filter(r => r.referrerCode.toUpperCase() === cleanCode);
  },

  createStudent(studentData: {
    name: string;
    email: string;
    college: string;
    branch: string;
    graduationYear: string;
    referralCodeInput?: string | null;
  }): { student: Student; referrerAttributed?: Student; warning?: string } {
    const data = ensureDbExists();
    const cleanEmail = studentData.email.trim().toLowerCase();

    // Check duplicate email
    const existing = data.students.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`A registration with email "${cleanEmail}" already exists. Each student may register once.`);
    }

    // Check unique referral code generation
    let myReferralCode = generateReferralCode();
    while (data.students.some(s => s.referralCode === myReferralCode)) {
      myReferralCode = generateReferralCode();
    }

    let attributedReferrer: Student | undefined = undefined;
    let validReferredByCode: string | null = null;
    let warning: string | undefined = undefined;

    if (studentData.referralCodeInput) {
      const cleanRefInput = studentData.referralCodeInput.trim().toUpperCase();
      const referrer = data.students.find(s => s.referralCode.toUpperCase() === cleanRefInput);

      if (!referrer) {
        warning = `Referral code "${cleanRefInput}" was not found. You were registered successfully as a direct registration.`;
      } else if (referrer.email.toLowerCase() === cleanEmail) {
        warning = `Self-referral is not allowed. You were registered as a direct participant.`;
      } else {
        attributedReferrer = referrer;
        validReferredByCode = referrer.referralCode;
        referrer.referralCount = (referrer.referralCount || 0) + 1;
      }
    }

    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: studentData.name.trim(),
      email: cleanEmail,
      college: studentData.college.trim(),
      branch: studentData.branch.trim(),
      graduationYear: studentData.graduationYear,
      referralCode: myReferralCode,
      referredBy: validReferredByCode,
      referralCount: 0,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    data.students.unshift(newStudent);

    if (attributedReferrer) {
      const newReferral: Referral = {
        id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        referrerId: attributedReferrer.id,
        referrerCode: attributedReferrer.referralCode,
        referredStudentId: newStudent.id,
        referredStudentName: newStudent.name,
        referredStudentCollege: newStudent.college,
        createdAt: newStudent.createdAt,
      };
      data.referrals.unshift(newReferral);
    }

    saveDb(data);

    return {
      student: newStudent,
      referrerAttributed: attributedReferrer,
      warning,
    };
  },

  getLeaderboard(limit = 50, currentUserIdOrCode?: string): { leaderboard: LeaderboardEntry[]; userRank?: number } {
    const data = ensureDbExists();

    // Sort students by referralCount descending, then by createdAt ascending
    const sorted = [...data.students]
      .filter(s => s.referralCount > 0)
      .sort((a, b) => {
        if (b.referralCount !== a.referralCount) {
          return b.referralCount - a.referralCount;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    let userRank: number | undefined = undefined;

    if (currentUserIdOrCode) {
      const cleanSearch = currentUserIdOrCode.trim().toUpperCase();
      const foundIdx = sorted.findIndex(s => s.id === currentUserIdOrCode || s.referralCode.toUpperCase() === cleanSearch);
      if (foundIdx !== -1) {
        userRank = foundIdx + 1;
      }
    }

    const leaderboard: LeaderboardEntry[] = sorted.slice(0, limit).map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      college: s.college,
      branch: s.branch,
      referralCode: s.referralCode,
      referralCount: s.referralCount,
      isCurrentUser: currentUserIdOrCode ? (s.id === currentUserIdOrCode || s.referralCode.toUpperCase() === currentUserIdOrCode.toUpperCase()) : false,
    }));

    return { leaderboard, userRank };
  },

  getAdminStats(): AdminStats {
    const data = ensureDbExists();
    const students = data.students;
    const referrals = data.referrals;
    const target = data.config.targetRegistrations || 500;
    const budget = data.config.budgetTotal || 2000;

    const totalRegistrations = students.length;
    const remainingRegistrations = Math.max(0, target - totalRegistrations);
    const progressPercentage = Math.min(100, Math.round((totalRegistrations / target) * 100));

    const totalReferredRegistrations = students.filter(s => !!s.referredBy).length;
    const totalDirectRegistrations = totalRegistrations - totalReferredRegistrations;
    const referralSharePercentage = totalRegistrations > 0 ? Math.round((totalReferredRegistrations / totalRegistrations) * 100) : 0;

    const activeReferrers = students.filter(s => s.referralCount > 0);
    const activeReferrersCount = activeReferrers.length;
    const totalReferralsGenerated = referrals.length;
    const avgReferralsPerActiveReferrer = activeReferrersCount > 0
      ? Number((totalReferralsGenerated / activeReferrersCount).toFixed(2))
      : 0;

    // Virality K-factor: K = (active referrers / total students) * avg referrals generated per active referrer
    const sharingRate = totalRegistrations > 0 ? activeReferrersCount / totalRegistrations : 0;
    const viralityKFactor = Number((sharingRate * avgReferralsPerActiveReferrer).toFixed(2));

    const effectiveCPA = totalRegistrations > 0 ? Number((budget / totalRegistrations).toFixed(2)) : 0;

    // Daily trends calculation
    const dayMap = new Map<string, { direct: number; referral: number }>();
    const now = new Date();
    
    // Initialize past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split('T')[0];
      dayMap.set(key, { direct: 0, referral: 0 });
    }

    students.forEach(s => {
      const dateKey = s.createdAt.split('T')[0];
      const entry = dayMap.get(dateKey) || { direct: 0, referral: 0 };
      if (s.referredBy) {
        entry.referral += 1;
      } else {
        entry.direct += 1;
      }
      dayMap.set(dateKey, entry);
    });

    const dailyTrends: DailyTrend[] = Array.from(dayMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, counts]) => {
        const d = new Date(date);
        const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          date,
          displayDate,
          direct: counts.direct,
          referral: counts.referral,
          total: counts.direct + counts.referral,
        };
      });

    // College distribution
    const collegeMap = new Map<string, { total: number; referrals: number }>();
    students.forEach(s => {
      const c = s.college || 'Other';
      const curr = collegeMap.get(c) || { total: 0, referrals: 0 };
      curr.total += 1;
      if (s.referredBy) curr.referrals += 1;
      collegeMap.set(c, curr);
    });

    const collegeBreakdown: CollegeStat[] = Array.from(collegeMap.entries())
      .map(([college, stats]) => ({
        college,
        count: stats.total,
        referrals: stats.referrals,
        percentage: totalRegistrations > 0 ? Math.round((stats.total / totalRegistrations) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Branch breakdown
    const branchMap = new Map<string, number>();
    students.forEach(s => {
      const b = s.branch || 'Other';
      branchMap.set(b, (branchMap.get(b) || 0) + 1);
    });

    const branchBreakdown: BranchStat[] = Array.from(branchMap.entries())
      .map(([branch, count]) => ({
        branch,
        count,
        percentage: totalRegistrations > 0 ? Math.round((count / totalRegistrations) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Top 10 referrers
    const topReferrers = this.getLeaderboard(10).leaderboard;

    // Recent 10 registrations
    const recentRegistrations = students.slice(0, 10).map(s => ({
      id: s.id,
      name: s.name,
      college: s.college,
      branch: s.branch,
      referredBy: s.referredBy,
      referralCode: s.referralCode,
      createdAt: s.createdAt,
      isDemo: s.isDemo,
    }));

    return {
      targetRegistrations: target,
      totalRegistrations,
      remainingRegistrations,
      progressPercentage,
      totalReferredRegistrations,
      totalDirectRegistrations,
      referralSharePercentage,
      activeReferrersCount,
      totalReferralsGenerated,
      avgReferralsPerActiveReferrer,
      viralityKFactor,
      budgetTotal: budget,
      effectiveCPA,
      industryBenchmarkCPA: 140, // standard benchmark ₹140/acquisition
      dailyTrends,
      collegeBreakdown,
      branchBreakdown,
      topReferrers,
      recentRegistrations,
    };
  },

  resetDatabase(): void {
    const seed = generateSeedData();
    saveDb(seed);
  },

  clearDatabase(): void {
    const empty: DatabaseSchema = {
      students: [],
      referrals: [],
      config: {
        targetRegistrations: 500,
        budgetTotal: 2000,
        campaignStartDate: new Date().toISOString(),
        campaignEndDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      }
    };
    saveDb(empty);
  }
};
