import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'

export async function requireAdmin(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  return null
}
