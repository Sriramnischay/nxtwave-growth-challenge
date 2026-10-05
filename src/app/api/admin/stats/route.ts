import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const stats = db.getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Error calculating admin growth statistics'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'reset') {
      db.resetDatabase();
      return NextResponse.json({ success: true, message: 'Database reset to benchmark simulation seed dataset successfully.' });
    }

    if (action === 'clear') {
      db.clearDatabase();
      return NextResponse.json({ success: true, message: 'All registration data cleared.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Error executing admin action'
    }, { status: 500 });
  }
}
