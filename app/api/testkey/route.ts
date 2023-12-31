import { NextResponse } from 'next/server';

export function POST(req: Request) {
  return NextResponse.json({ valid: true }, { status: 200 });
}
