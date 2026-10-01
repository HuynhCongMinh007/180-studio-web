import { ApiError } from "../types"
export type ApiErrorBody = ApiError | string | null

export type FieldErrors = Record<string, string>

export class ApiRequestError extends Error {
    readonly status: number
    readonly method: string
    readonly url: string
    readonly body: ApiErrorBody

    constructor(params: {
        message: string
        status: number
        method: string
        url: string
        body: ApiErrorBody
    }) {
        super(params.message)
        this.name = 'ApiRequestError'
        this.status = params.status
        this.method = params.method
        this.url = params.url
        this.body = params.body
    }

    private get apiError(): ApiError | null {
        return typeof this.body === 'object' && this.body !== null ? this.body : null
    }

    get messageCode(): string | undefined {
        return this.apiError?.messageCode
    }

    get requestId(): string | undefined {
        return this.apiError?.requestId
    }

    get fieldErrors(): FieldErrors {
        const details = this.apiError?.error?.details
        const result: FieldErrors = {}

        if (!Array.isArray(details)) return result

        for (const detail of details) {
            if (detail.message && !(detail.field in result)) {
                result[detail.field] = detail.message
            }
        }
        return result
    }
}
