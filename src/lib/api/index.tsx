import qs from 'qs'
import { getCookies } from "../utils/getCookies";
import { ApiResponse } from '@/lib/types/generals';
import { ApiErrorBody, ApiRequestError } from './api-error';

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
        const method = (fetchOptions.method ?? 'GET').toUpperCase()

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

        let res: Response
        try {
            res = await fetch(url, config)
        } catch (cause) {
            console.error(`[API network error] ${method} ${url}`, cause)
            throw new ApiRequestError({
                message: `${method} ${url} failed: no response from server`,
                status: 0,
                method,
                url,
                body: null,
            })
        }

        if (!res.ok) {
            const text = await res.text()
            let body: ApiErrorBody = text || null
            try {
                body = JSON.parse(text)
            } catch {
            }

            const apiError = typeof body === 'object' && body !== null ? body : null
            const message = apiError?.message || `${method} ${endpoint} failed (${res.status})`

            console.error(`[API ${res.status}] ${method} ${url}`, {
                messageCode: apiError?.messageCode,
                requestId: apiError?.requestId,
                details: apiError?.error?.details,
                rawBody: apiError ? undefined : text.slice(0, 200),
            })

            throw new ApiRequestError({ message, status: res.status, method, url, body })
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

const isServer = typeof window === 'undefined'
const defaultBaseUrl = (isServer ? process.env.BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL) || ''

const api = new Api(defaultBaseUrl)

export { api }
