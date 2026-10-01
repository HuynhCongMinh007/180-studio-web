import { api } from "../api";
import { ENDPOINTS } from "../constants/endpoints";
import { HomeSlideResponse } from "../types/home-slides";

export async function HomeSlides(): Promise<HomeSlideResponse[]> {
    const url = ENDPOINTS.HOME_SLIDES
    const res = await api.get<HomeSlideResponse[]>(url)
    return res.data
}