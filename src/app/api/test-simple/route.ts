import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('✅ Simple test endpoint called successfully')
    
    return NextResponse.json({ 
      success: true,
      message: 'API endpoint is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    })
  } catch (error) {
    console.error('❌ Simple test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Something went wrong',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('✅ POST received data:', data)
    
    return NextResponse.json({ 
      success: true,
      message: 'POST request processed successfully!',
      receivedData: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'POST error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 