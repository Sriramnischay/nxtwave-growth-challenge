import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const userCode = searchParams.get('userCode') || undefined;

    const limit = limitParam ? Math.min(100, parseInt(limitParam, 10)) : 50;
    const { leaderboard, userRank } = db.getLeaderboard(limit, userCode);
    const totalStudents = db.getStudents().length;
    const totalReferrals = db.getStudents().reduce((acc, s) => acc + (s.referralCount || 0), 0);

    return NextResponse.json({
      success: true,
      leaderboard,
      userRank,
      stats: {
        totalStudents,
        totalReferrals,
        topReferrerCount: leaderboard[0]?.referralCount || 0,
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Error fetching leaderboard'
    }, { status: 500 });
  }
}
