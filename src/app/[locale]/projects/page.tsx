import { getProjects } from '@/lib/services/project.service'
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
    limit = 6
  }
  if (limit > 100) {
    limit = 100
  }

  const res = await getProjects({ page, limit })

  return <ProjectsView projects={res.data} pagination={res.metadata} />
}
