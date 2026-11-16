import type { HomeSlideResponse } from '@/lib/types/home-slides'
import type { ProjectDetailImage } from '@/lib/types/projects'

export function toProjectSlides(
  images: ProjectDetailImage[],
  alt: string,
): HomeSlideResponse[] {
  return images
    .filter((image) => image.coverPriority !== null)
    .sort((a, b) => (a.coverPriority ?? 0) - (b.coverPriority ?? 0))
    .map((image, index) => ({
      id: index,
      image: { url: image.imageUrl, publicId: '', alt },
      postion: index,
    }))
}
