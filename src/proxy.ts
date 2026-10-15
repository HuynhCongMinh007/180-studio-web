import { NextRequest, NextResponse } from "next/server";
const locales = ['en', 'vi']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const hasLocale = locales.some((l) => (pathname === `/${l}` || pathname.startsWith(`/${l}`)))
    if (hasLocale) {
        return NextResponse.next()
    }
    const cookieLocale = request.cookies.get('locale')?.value
    const locale = locales.includes(cookieLocale ?? "") ? cookieLocale : 'vi'
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname === '' ? "" : pathname}`
    return NextResponse.redirect(url)
}

export const config = {
    // Skip api, Next.js internals and any path with a file extension (public images, fonts, svg).
    matcher: ['/((?!api|_next/static|_next/image|.well-known|.*\\..*).*)'],
}