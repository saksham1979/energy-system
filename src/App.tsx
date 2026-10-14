import { useEffect, useMemo } from "react";
import homeDocument from "../legacy-site/index.html?raw";
import aboutDocument from "../legacy-site/pages/about-us.html?raw";
import commercialDocument from "../legacy-site/pages/commercial-ro.html?raw";
import contactDocument from "../legacy-site/pages/contact.html?raw";
import domesticDocument from "../legacy-site/pages/domestic-ro.html?raw";
import faqDocument from "../legacy-site/pages/faq.html?raw";
import industrialDocument from "../legacy-site/pages/industrial-ro.html?raw";
import servicesDocument from "../legacy-site/pages/services-amc.html?raw";
import sparePartsDocument from "../legacy-site/pages/spare-parts.html?raw";
import waterAtmDocument from "../legacy-site/pages/water-atm.html?raw";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import { initPageInteractions } from "@/lib/page-interactions";

const routeDocuments: Record<string, string> = {
  "/": homeDocument,
  "/index.html": homeDocument,
  "/pages/about-us.html": aboutDocument,
  "/pages/commercial-ro.html": commercialDocument,
  "/pages/contact.html": contactDocument,
  "/pages/domestic-ro.html": domesticDocument,
  "/pages/faq.html": faqDocument,
  "/pages/industrial-ro.html": industrialDocument,
  "/pages/services-amc.html": servicesDocument,
  "/pages/spare-parts.html": sparePartsDocument,
  "/pages/water-atm.html": waterAtmDocument,
};

const modelFiles = import.meta.glob<string>(
  "../assets/ro-models/*.{avif,jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" },
);
const projectFiles = import.meta.glob<string>(
  "../assets/projects/*.{avif,jpg,jpeg,png,webp}",
  { eager: true, import: "default", query: "?url" },
);

function imageLabel(filePath: string) {
  return (filePath.split("/").pop() ?? "Water purification system")
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const uploadedImages = [
  ...Object.entries(modelFiles).map(([filePath, src]) => ({
    src,
    alt: `${imageLabel(filePath)} water purifier model`,
  })),
  ...Object.entries(projectFiles).map(([filePath, src]) => ({
    src,
    alt: `${imageLabel(filePath)} completed water purification installation`,
  })),
];

const showcaseImages = uploadedImages.length
  ? uploadedImages
  : [
      {
        src: "/assets/BG_homepage1.png",
        alt: "Energy System water purifier and industrial RO plant",
      },
      {
        src: "/assets/water%20atm/water%20atm%20machine.jpg.png",
        alt: "Energy System community Water ATM installation",
      },
    ];

const heroMarker = '<div data-react-home-hero="true"></div>';

function readPage(documentSource: string, isHome: boolean) {
  const parsed = new DOMParser().parseFromString(documentSource, "text/html");
  parsed.body.querySelectorAll("script").forEach((script) => script.remove());
  let markup = parsed.body.innerHTML.replace(/(?:\.\.\/)?assets\//g, "/");

  if (isHome) {
    const hero = parsed.body.querySelector("section.hero");
    if (hero) {
      hero.outerHTML = heroMarker;
      markup = parsed.body.innerHTML.replace(/(?:\.\.\/)?assets\//g, "/");
    }
  }

  return { title: parsed.title, markup };
}

function HomeHero() {
  return (
    <TiltedGridHero
      images={showcaseImages}
      speed={4.5}
      tileHeight={32}
      gap={5}
      axis={55}
      curve={72}
      fade={10}
      className="home-tilted-hero relative w-full overflow-hidden"
      aria-label="Rotating showcase of Energy System RO models and completed installations"
    >
      <div className="home-hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 py-14 text-center sm:px-10">
        <span className="mb-5 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:text-sm">
          Energy System · Water Purification Since 2009
        </span>
        <h1 className="mb-5 max-w-4xl font-bold tracking-tight text-white">
          Pure water.<br />
          Built for every scale.
        </h1>
        <p className="mb-8 max-w-2xl text-base sm:text-lg">
          Explore our RO models and water treatment installations for homes,
          businesses, and communities.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="pages/domestic-ro.html" className="btn btn-primary btn-lg">
            Explore RO systems
          </a>
          <a href="pages/contact.html" className="btn btn-secondary btn-lg">
            Request a quote
          </a>
        </div>
      </div>
    </TiltedGridHero>
  );
}

export default function App() {
  const currentPath = window.location.pathname;
  const isHome = currentPath === "/" || currentPath.endsWith("/index.html");
  const documentSource = routeDocuments[currentPath] ?? homeDocument;
  const page = useMemo(
    () => readPage(documentSource, isHome),
    [documentSource, isHome],
  );
  const heroPosition = isHome ? page.markup.indexOf(heroMarker) : -1;

  useEffect(() => {
    document.title = page.title || "Energy System — Water Purification";
    return initPageInteractions();
  }, [page]);

  if (heroPosition < 0) {
    return <div className="legacy-page" dangerouslySetInnerHTML={{ __html: page.markup }} />;
  }

  const beforeHero = page.markup.slice(0, heroPosition);
  const afterHero = page.markup.slice(heroPosition + heroMarker.length);

  return (
    <>
      <div className="legacy-page" dangerouslySetInnerHTML={{ __html: beforeHero }} />
      <HomeHero />
      <div className="legacy-page" dangerouslySetInnerHTML={{ __html: afterHero }} />
    </>
  );
}
