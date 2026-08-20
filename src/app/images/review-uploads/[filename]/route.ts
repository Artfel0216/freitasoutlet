import { NextRequest, NextResponse } from 'next/server'
import { serveUpload } from '@/lib/upload-serve'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
): Promise<NextResponse> {
  const { filename } = await params
  return serveUpload('review-uploads', filename)
}