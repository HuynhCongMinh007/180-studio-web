export interface ApiBase {
    success: boolean
    message: string
    requestId: string
    timestamp: string
}

export interface ApiError extends ApiBase {
    messageCode: string
    error?: {
        details: | {
            field: string
            message?: string
        }[] | string
    }
    path: string
}

export interface ApiResponse<T = any> extends ApiBase {
    data: T,
    metadata?: {
        page: number
        limit: number
        total: number
        totalPages: number
        nextPage: number | null
        prevPage: number | null
    }
}