export interface AssetRefResponse {
    url: string
    publicId: string
    alt?: string
}
export interface HomeSlideResponse {
    id: number
    image: AssetRefResponse
    postion: number
}