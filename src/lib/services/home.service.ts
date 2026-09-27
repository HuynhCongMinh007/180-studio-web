import { api } from "../api";
import { mockHomeSlides } from "../mock/home-slides";

export async function Slides() {
    const url = 'mock'
    // const res = api.get(url)
    const res = mockHomeSlides
    return res
}