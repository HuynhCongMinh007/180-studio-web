import { NextRequest, NextResponse } from "next/server";
import { getCookies } from "./lib/utils/getCookies";
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
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.well-known).*)'],
}