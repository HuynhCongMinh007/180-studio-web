import { getProjects } from "@/lib/services/project.service";
import { ProjectsView } from "./projects-view";

export default async function ProjectsPage() {
  const res = await getProjects()

  return (
    <ProjectsView projects={res} />
  );
}
