import { HomeSlideshow } from "@/components/public/home-slideshow";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { mockHomeSlides } from "@/lib/mock/home-slides";

export default function Home() {
  return (
    // The page is exactly one screen tall. The slideshow takes the space left by the footer.
    <div className="relative flex h-svh flex-col">
      <SiteHeader />
      <main className="relative flex-1">
        <HomeSlideshow slides={mockHomeSlides} />
      </main>
      <SiteFooter />
    </div>
  );
}