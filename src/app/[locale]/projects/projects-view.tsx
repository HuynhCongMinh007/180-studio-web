import { ProjectGrid } from "@/app/[locale]/projects/project-grid";
import { SiteFooter } from "@/app/[locale]/home/site-footer";
import { SiteHeader } from "@/app/[locale]/home/site-header";

export function ProjectsView({
    projects,
}: {
    projects: any;
}) {

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
