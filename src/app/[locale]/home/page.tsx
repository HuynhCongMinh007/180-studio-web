import { HomeSlideshow } from "./home-slideshow";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { HomeSlides } from "@/lib/services/home.service";

export default async function Home() {
  const slides = await HomeSlides()
  return (
    <div className="relative flex h-svh flex-col">
      <SiteHeader />
      <main className="relative flex-1">
        <HomeSlideshow slides={slides} />
      </main>
      <SiteFooter />
    </div>
  );
}