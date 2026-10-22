import Link from 'next/link'
import type { ProjectListItemResponse } from '@/lib/types/projects'

export function ProjectGrid({
  projects,
}: {
  projects: ProjectListItemResponse[]
}) {
  if (projects.length === 0) {
    return <p className="py-32 text-center text-neutral-500">No projects yet</p>
  }

  return (
    <ul className="grid gap-3 p-3 sm:grid-cols-2">
      {projects.map((project, index) => (
        <li key={project.id}>
          {/* Dark fallback keeps the white name readable when a project has no image. */}
          <Link
            href={`/projects/${project.id}`}
            className="relative block aspect-4/3 bg-neutral-800"
          >
            {project.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.imageUrl}
                alt=""
                loading={index < 3 ? 'eager' : 'lazy'}
                className="size-full object-cover"
              />
            )}
            <h2 className="absolute inset-x-0 top-8 text-center font-semibold text-white text-shadow-md">
              {project.name}
            </h2>
          </Link>
        </li>
      ))}
    </ul>
  )
}
