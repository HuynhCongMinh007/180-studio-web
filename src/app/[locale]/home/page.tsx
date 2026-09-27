import { HomeSlideshow } from "./home-slideshow";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { mockHomeSlides } from "@/lib/mock/home-slides";
import { Slides } from "@/lib/services/home.service";

export default async function Home() {
  const slides =await Slides() 
  return (
    // The page is exactly one screen tall. The slideshow takes the space left by the footer.
    <div className="relative flex h-svh flex-col">
      <SiteHeader />
      <main className="relative flex-1">
        <HomeSlideshow slides={slides} />
      </main>
      <SiteFooter />
    </div>
  );
}