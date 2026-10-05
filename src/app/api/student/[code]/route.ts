import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { MILESTONES } from '@/lib/constants';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const rawCode = params.code;
    if (!rawCode) {
      return NextResponse.json({ success: false, error: 'Student code is required' }, { status: 400 });
    }

    // Sequential async lookups — cannot use || with Promises
    let student = await db.getStudentByReferralCode(rawCode);
    if (!student) student = await db.getStudentById(rawCode);
    if (!student) student = await db.getStudentByEmail(rawCode);

    if (!student) {
      return NextResponse.json({
        success: false,
        error: `No registered student found matching code "${rawCode}". Please check your code or register again.`
      }, { status: 404 });
    }

    // Get referrals made by this student
    const referrals = await db.getReferralsByReferrerId(student.id);

    // Get leaderboard rank
    const { leaderboard, userRank } = await db.getLeaderboard(100, student.referralCode);

    // Calculate milestones
    const milestones = MILESTONES.map(m => ({
      ...m,
      unlocked: (student!.referralCount || 0) >= m.referralsRequired,
    }));

    // Find next milestone
    const nextMilestone = milestones.find(m => !m.unlocked) || null;
    const progressToNext = nextMilestone
      ? Math.min(100, Math.round(((student.referralCount || 0) / nextMilestone.referralsRequired) * 100))
      : 100;

    const totalParticipants = (await db.getStudents()).length;

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        college: student.college,
        branch: student.branch,
        graduationYear: student.graduationYear,
        referralCode: student.referralCode,
        referredBy: student.referredBy,
        referralCount: student.referralCount || 0,
        createdAt: student.createdAt,
      },
      referrals: referrals.map(r => ({
        id: r.id,
        referredStudentName: r.referredStudentName,
        referredStudentCollege: r.referredStudentCollege,
        createdAt: r.createdAt,
      })),
      rank: userRank || null,
      milestones,
      nextMilestone,
      progressToNext,
      totalParticipants,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Server error loading student profile'
    }, { status: 500 });
  }
}
