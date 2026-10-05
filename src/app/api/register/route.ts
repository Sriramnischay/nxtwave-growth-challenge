import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, college, branch, graduationYear, referralCode } = body;

    // Validate presence
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }
    if (!college || !college.trim()) {
      return NextResponse.json({ success: false, error: 'College / Institute name is required.' }, { status: 400 });
    }
    if (!branch || !branch.trim()) {
      return NextResponse.json({ success: false, error: 'Engineering branch is required.' }, { status: 400 });
    }
    if (!graduationYear || !graduationYear.trim()) {
      return NextResponse.json({ success: false, error: 'Graduation year is required.' }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Attempt creation
    const result = await db.createStudent({
      name,
      email,
      college,
      branch,
      graduationYear,
      referralCodeInput: referralCode || null,
    });

    return NextResponse.json({
      success: true,
      student: result.student,
      referrerAttributed: result.referrerAttributed ? {
        name: result.referrerAttributed.name,
        college: result.referrerAttributed.college,
        referralCode: result.referrerAttributed.referralCode,
      } : null,
      warning: result.warning,
      message: result.referrerAttributed 
        ? `🎉 Registered successfully! Referral bonus credited to ${result.referrerAttributed.name}.`
        : `🎉 You are officially registered for the workshop!`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'An error occurred during registration. Please try again.',
    }, { status: 400 });
  }
}
