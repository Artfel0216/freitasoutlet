import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/database'

export async function GET() {
  const start = Date.now()

  try {
    await queryOne('SELECT 1')

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'healthy',
      responseTimeMs: Date.now() - start,
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'unhealthy',
      responseTimeMs: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 })
  }
}
