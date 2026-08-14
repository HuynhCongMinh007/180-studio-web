import qs from 'qs'
import { getCookies } from "../utils/getCookies";
import { ApiError, ApiResponse } from '@/lib/types/generals';

type RequestOptions = RequestInit & { params?: Record<string, any> }

/**
 * HTTP client wrapper around `fetch` that injects auth and locale headers.
 */
export class Api {
    private baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    /**
     * Sends an HTTP request to the given endpoint, merging auth and locale headers.
     *
     * @param endpoint - API path appended to the base URL.
     * @param options - Fetch options plus optional `params` serialized as a query string.
     * @returns The raw `Response` from `fetch`.
     */
    async request(
        endpoint: string,
        options: RequestOptions = {}): Promise<Response> {

        const { params, headers: customHeaders, ...fetchOptions } = options
        const accessToken = await getCookies('accessToken')
        const locale = await getCookies('locale')

        // addQueryPrefix prepends '?' so it can be concatenated directly onto the URL below
        const queryString = params ? qs.stringify(params, { addQueryPrefix: true }) : ''
        const url = `${this.baseUrl}${endpoint}${queryString}`

        const config: RequestInit = {
            credentials: 'include',
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                'x-lang': locale || 'vi',
                ...(accessToken ? {
                    Authorization: `Bearer ${accessToken}`
                } : {}),
                ...(customHeaders),
            },
        }

        const res = await fetch(url, config)

        if (!res.ok) {
            const errorData = await (await res.json()) as ApiError
            console.error('API Error:', errorData)
            throw new Error(
                Array.isArray(errorData.error?.details) ? errorData.error?.details[0]?.message
                    : errorData.error?.details || 'Something went wrong',
            )
        }
        return res
    }

    async get<T>(
        endpoint: string,
        options?: Omit<RequestOptions, 'method'>
    ): Promise<ApiResponse<T>> {
        const res = await this.request(endpoint, { method: 'GET', cache: 'no-store', ...options })
        return res.json()
    }
    async post<T>(
        endpoint: string,
        data?: any
    ): Promise<ApiResponse<T>> {
        const res = await this.request(endpoint,
            {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            }
        )
        return res.json()
    }
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const res = await this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        })
        return res.json()
    }
    async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
        const res = await this.request(
            endpoint,
            {
                method: 'PATCH',
                body: data ? JSON.stringify(data) : undefined
            }
        )
        return res.json()
    }
    async delete<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        const res = await this.request(
            endpoint,
            {
                method: 'DELETE',
                body: data ? JSON.stringify(data) : undefined,
            }
        )
        return res.json()
    }
}

// `window` only exists in the browser, so this is the standard way to detect
// whether the module is currently evaluated on the server or the client.
const isServer = typeof window === 'undefined'

// Next.js only inlines env vars prefixed with NEXT_PUBLIC_ into the client bundle;
// server-only vars (no prefix) are never exposed to the browser for security reasons.
// That's why the base URL source must branch on `isServer` instead of using one var everywhere.
const defaultBaseUrl = (isServer ? process.env.BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL) || ''

const api = new Api(defaultBaseUrl)

export {api}
