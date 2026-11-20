import { HomeSlideshow } from '@/app/[locale]/home/home-slideshow'
import { ProjectGallery } from '@/app/[locale]/projects/[id]/project-gallery'
import { ProjectDetail } from '@/lib/types/projects'
import { toProjectSlides } from '@/lib/utils/project-slides'
import { toYouTubeEmbedUrl } from '@/lib/utils/video-embed'

export function DetailProject({ project }: { project: ProjectDetail }) {
  const videoEmbedUrl = project.videoUrl
    ? toYouTubeEmbedUrl(project.videoUrl)
    : null

  return (
    <main>
      <div className="mx-auto aspect-video w-full max-w-480">
        <HomeSlideshow
          slides={toProjectSlides(project.projectImages, project.name)}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-2">
            <h2>{project.name}</h2>
            <span>Year: {project.year}</span>
            <span>Location: {project.location}</span>
            <span>Site area: {project.siteArea || '...'}</span>
            <span>Floor area: {project.floorArea || '...'}</span>
            <span>Client: {project.client || '...'}</span>
            <span>Photographer: {project.photographer}</span>
            {videoEmbedUrl && (
              <iframe
                src={videoEmbedUrl}
                title={project.name}
                className="my-4 aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            <span>Project gallery</span>
            <ProjectGallery
              images={project.projectImages}
              projectName={project.name}
            />
          </div>
          <div>
            <h4>{project.name}</h4>
            {/* Mock description, to be replaced by data from the API. */}
            <div className="flex flex-col gap-4 mt-4">
              <p>
                Set on Bennelong Point, a narrow peninsula reaching into Sydney
                Harbour, the Sydney Opera House is one of the most recognisable
                buildings of the twentieth century. The Danish architect Jørn
                Utzon won the international design competition in 1957 with a
                set of loose sketches that showed a cluster of white shells
                rising from a heavy stone platform, like sails catching the wind
                above the water.
              </p>
              <p>
                The idea was simple to draw but very hard to build. For years,
                Utzon and the engineers at Ove Arup &amp; Partners searched for
                a way to give the free-form shells a geometry that could be
                calculated and made in a factory. The answer was to cut every
                shell from the surface of the same sphere. Because all the
                curves shared one radius, the roof could be assembled from
                repeated precast concrete ribs, and the whole building became a
                lesson in turning an artistic gesture into a logical system.
              </p>
              <p>
                The shells are covered with more than one million Swedish-made
                ceramic tiles in two finishes, glossy white and matte cream.
                Seen from a distance, they read as one smooth surface; up close,
                the subtle pattern changes with the sun, the clouds and the
                reflections from the harbour. Below the roof, the podium is clad
                in reconstituted granite and holds the stage machinery,
                rehearsal rooms and service spaces, leaving the shells free to
                float above the city.
              </p>
              <p>
                Construction began in 1959, but rising costs and political
                pressure led Utzon to leave the project in 1966, before the
                interiors were finished. A team of Australian architects led by
                Peter Hall completed the building, which was opened by Queen
                Elizabeth II on 20 October 1973. Decades later, Utzon was
                invited back to write design principles for the future of the
                building, and in 2007 the Opera House was added to the UNESCO
                World Heritage List as a masterpiece of human creative genius.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
