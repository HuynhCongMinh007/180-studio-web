import Link from 'next/link'
import type { ProjectListItemResponse } from '@/lib/types/projects'

/** Shows projects as a grid of cover images with the title on top of each image. */
export function ProjectGrid({
  projects,
}: {
  projects: ProjectListItemResponse[]
}) {
  // Empty state: a blank page would look broken.
  if (projects.length === 0) {
    return (
      <p className="py-32 text-center text-sm tracking-[0.3em] text-neutral-500 uppercase">
        No projects yet
      </p>
    )
  }

  return (
    // The 1px gap on a light background draws the thin lines between images.
    <ul className="grid grid-cols-1 gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.id} className="bg-white">
          <Link
            href={`/projects/${project.id}`}
            aria-label={project.title}
            // The grey background keeps the tile tidy if an image fails to load.
            className="group relative block aspect-4/3 overflow-hidden bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage.url}
              alt={project.coverImage.alt ?? project.title}
              // The first row is visible on load, so it should not wait for scrolling.
              loading={index < 3 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent transition-colors duration-500 group-hover:from-black/75" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
              <h2 className="text-sm font-medium tracking-[0.2em] uppercase sm:text-base">
                {project.title}
              </h2>
              <span
                aria-hidden
                className="translate-x-1 text-lg opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
              >
                →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
