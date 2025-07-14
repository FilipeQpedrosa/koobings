import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if our changes are deployed
    const fileContent = `
    // This should show our latest changes
    // Version: ${new Date().toISOString()}
    // Latest commit: fix: add select clause to business query to avoid slug field
    `;
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      latestCommit: "fix: add select clause to business query to avoid slug field",
      message: "Latest code is deployed",
      fileContent
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 