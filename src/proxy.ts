import { type NextRequest, NextResponse } from 'next/server'

// Supabase henüz aktif değil — env değişkenleri ayarlandığında aşağıdaki
// satırları açın ve bu middleware'i updateSession ile değiştirin.
// import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(_request: NextRequest) {
    // TODO: Supabase aktif edilince: return await updateSession(request)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
