/** One item of GET /projects. imageUrl is null when the project has no image. */
export interface ProjectListItemResponse {
  id: string
  name: string
  imageUrl: string | null
}
