import type { ProjectsListItem } from '@/lib/types/projects'
import type { PaginationMeta } from '@/lib/types/generals'
import { ProjectGrid } from '@/app/[locale]/projects/project-grid'
import { SiteFooter } from '@/app/[locale]/home/site-footer'
import { SiteHeader } from '@/app/[locale]/home/site-header'
import { ListPagination } from '@/components/common/pagination'

type ProjectsViewProps = {
  projects: ProjectsListItem[]
  pagination?: PaginationMeta
}

export function ProjectsView(props: ProjectsViewProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-480 flex-1 flex-col">
        <h1 className="sr-only">Projects</h1>
        <ProjectGrid
          projects={props.projects}
          featureFirst={(props.pagination?.page ?? 1) === 1}
        />
        {props.pagination && (
          <div className="mt-auto py-8">
            <ListPagination pagination={props.pagination} />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
