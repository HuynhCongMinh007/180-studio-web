import Link from 'next/link'
import type { ProjectsListItem } from '@/lib/types/projects'

type ProjectGridProps = {
  projects: ProjectsListItem[]
  featureFirst: boolean
}

export function ProjectGrid({ projects, featureFirst }: ProjectGridProps) {
  if (projects.length === 0) {
    return <p className="py-32 text-center text-neutral-500">No projects yet</p>
  }

  return (
    <ul className="grid gap-3 p-3 sm:grid-cols-2">
      {projects.map((project, index) => {
        const isFeatured = featureFirst && index === 0

        return (
          <li key={project.id} className={isFeatured ? 'sm:col-span-2' : ''}>
            <Link
              href={`/projects/${project.id}`}
              className={`relative block bg-neutral-800 ${isFeatured ? 'aspect-4/3 sm:aspect-video' : 'aspect-4/3'}`}
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

              <h3
                className={`absolute inset-x-0 top-8 text-center text-white text-shadow-md ${isFeatured ? 'text-5xl' : ''}`}
              >
                {project.name}
              </h3>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
