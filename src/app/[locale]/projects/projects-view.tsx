import type { ProjectListItemResponse } from '@/lib/types/projects'
import { ProjectGrid } from '@/app/[locale]/projects/project-grid'
import { SiteFooter } from '@/app/[locale]/home/site-footer'
import { SiteHeader } from '@/app/[locale]/home/site-header'

export function ProjectsView({ projects }: { projects: ProjectListItemResponse[] }) {
  return (
    <div className="relative flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <h1 className="sr-only">Projects</h1>
        <ProjectGrid projects={projects} />
      </main>
      <SiteFooter />
    </div>
  )
}
