import { getProjects } from '@/lib/services/project.service'
import type { PaginationMeta } from '@/lib/types/generals'
import { ProjectsView } from './projects-view'

export default async function ProjectsPage({
  searchParams,
}: PageProps<'/[locale]/projects'>) {
  const query = await searchParams

  let page = Math.floor(Number(query.page))
  if (!page || page < 1) {
    page = 1
  }

  let limit = Math.floor(Number(query.limit))
  if (!limit || limit < 1) {
    limit = 2
  }
  if (limit > 100) {
    limit = 100
  }

  const firstPageLimit = limit + 1
  const res = await getProjects(
    page === 1
      ? { limit: firstPageLimit, offset: 0 }
      : { limit, offset: firstPageLimit + (page - 2) * limit },
  )

  let pagination: PaginationMeta | undefined
  if (res.metadata) {
    const total = res.metadata.total
    let totalPages = 1
    if (total > firstPageLimit) {
      totalPages = 1 + Math.ceil((total - firstPageLimit) / limit)
    }
    pagination = {
      page,
      limit,
      total,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    }
  }

  return <ProjectsView projects={res.data} pagination={pagination} />
}
