'use server'

import { cookies } from "next/headers";

export async function getCookies(key: string) {
    const cookiesStore = await cookies()
    return cookiesStore.get(key)?.value
}