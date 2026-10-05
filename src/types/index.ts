export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: string;
  referralCode: string;
  referredBy?: string | null; // referral code of the inviter
  referralCount: number;
  createdAt: string;
  isDemo?: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerCode: string;
  referredStudentId: string;
  referredStudentName: string;
  referredStudentCollege: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  college: string;
  branch: string;
  referralCode: string;
  referralCount: number;
  isCurrentUser?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  referralsRequired: number;
  perk: string;
  description: string;
  badge: string;
  unlocked: boolean;
}

export interface DailyTrend {
  date: string;
  displayDate: string;
  direct: number;
  referral: number;
  total: number;
}

export interface CollegeStat {
  college: string;
  count: number;
  referrals: number;
  percentage: number;
}

export interface BranchStat {
  branch: string;
  count: number;
  percentage: number;
}

export interface AdminStats {
  targetRegistrations: number;
  totalRegistrations: number;
  remainingRegistrations: number;
  progressPercentage: number;
  totalReferredRegistrations: number;
  totalDirectRegistrations: number;
  referralSharePercentage: number;
  activeReferrersCount: number;
  totalReferralsGenerated: number;
  avgReferralsPerActiveReferrer: number;
  viralityKFactor: number;
  budgetTotal: number;
  effectiveCPA: number; // ₹2000 / totalRegistrations
  industryBenchmarkCPA: number; // e.g. ₹120-180
  dailyTrends: DailyTrend[];
  collegeBreakdown: CollegeStat[];
  branchBreakdown: BranchStat[];
  topReferrers: LeaderboardEntry[];
  recentRegistrations: {
    id: string;
    name: string;
    college: string;
    branch: string;
    referredBy?: string | null;
    referralCode: string;
    createdAt: string;
    isDemo?: boolean;
  }[];
}
