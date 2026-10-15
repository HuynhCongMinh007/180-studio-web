import type { ProjectListItemResponse } from "@/lib/types/projects";

// Free sample photos from Unsplash, resized by the URL query (w = width in pixels).
const unsplash = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=1200&q=80&auto=format&fit=crop`;

// TODO(minh): Replace this mock data with the projects service call and delete this file.
export const PROJECTS_MOCK: ProjectListItemResponse[] = [
  { id: 1, title: "Thu House", coverImage: { url: unsplash("1600585154340-be6161a56a0c"), publicId: "mock-1", alt: "Modern house with a pool at dusk" } },
  { id: 2, title: "IGC Tay Ninh School", coverImage: { url: unsplash("1487958449943-2429e8be8625"), publicId: "mock-2", alt: "White curved building facade" } },
  { id: 3, title: "Bo Mon Preschool", coverImage: { url: unsplash("1600596542815-ffad4c1539a9"), publicId: "mock-3", alt: "House exterior with garden" } },
  { id: 4, title: "Studio Office", coverImage: { url: unsplash("1600607687939-ce8a6c25118c"), publicId: "mock-4", alt: "Bright interior living space" } },
  { id: 5, title: "Saigon Tower", coverImage: { url: unsplash("1511818966892-d7d671e672a2"), publicId: "mock-5", alt: "Geometric modern building" } },
  { id: 6, title: "Garden Villa", coverImage: { url: unsplash("1512917774080-9991f1c4c750"), publicId: "mock-6", alt: "Large villa with a lawn" } },
];
