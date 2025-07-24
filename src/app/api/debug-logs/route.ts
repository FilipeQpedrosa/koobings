import { NextRequest, NextResponse } from 'next/server';

// Store logs in memory for debugging (only for development)
const logs: string[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    logs: logs.slice(-50), // Last 50 logs
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const { message, level = 'info' } = await request.json();
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    console.log(logEntry);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' });
  }
}

export async function DELETE(request: NextRequest) {
  logs.length = 0;
  return NextResponse.json({ success: true, message: 'Logs cleared' });
} 