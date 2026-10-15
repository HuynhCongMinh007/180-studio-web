import { ProjectGrid } from "@/components/public/project-grid";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
// TODO(minh): Replace the mock import with the projects service call.
import { PROJECTS_MOCK } from "@/lib/mocks/projects";

export default async function ProjectsPage() {
  const projects = PROJECTS_MOCK;

  return (
    <div className="relative flex min-h-svh flex-col">
      <SiteHeader />
      {/* The header is positioned over the page, so this band reserves its space and gives the white text a dark background. */}
      <div aria-hidden className="h-28 bg-neutral-900 md:h-[90px]" />
      <main className="flex-1">
        <h1 className="sr-only">Projects</h1>
        <ProjectGrid projects={projects} />
      </main>
      <SiteFooter />
    </div>
  );
}
