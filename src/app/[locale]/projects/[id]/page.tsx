import { DetailProject } from '@/app/[locale]/projects/[id]/detail-project'
import { getProject } from '@/lib/services/project.service'

export default async function Project({
  params,
}: PageProps<'/[locale]/projects/[id]'>) {
  const { id } = await params
  const res = await getProject(id)
  const data = res.data
  console.log(data)

  return <DetailProject project={data} />
}
