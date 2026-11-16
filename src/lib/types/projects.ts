export interface ProjectsListItem {
  id: string
  name: string
  imageUrl: string | null
}

export interface ProjectDetailImage {
  imageUrl: string
  coverPriority: number | null
}

export interface ProjectDetail {
  id: string
  name: string
  year: number | null
  location: string | null
  siteArea: number | null
  floorArea: number | null
  client: string | null
  photographer: string | null
  videoUrl: string | null
  projectImages: ProjectDetailImage[]
}

export interface Project {
  GET: ProjectsListItem[]
  GET_DETAIL: ProjectDetail
}
