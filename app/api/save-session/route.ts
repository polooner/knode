import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const data = await req.json();

  console.log(data);

  const { error } = await supabase.from('canvas').insert(data);
  console.log(error);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'ok' }, { status: 200 });
}
