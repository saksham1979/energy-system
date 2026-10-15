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
import homeWallpaper from "../assets/bg-homepage.webp";
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

const modelOrder = [
  "domestic-ro-purifier",
  "commercial-ro-25-lph-cabinet",
  "commercial-ro-25-lph-open-frame",
];

const orderedModelFiles = Object.entries(modelFiles).sort(([left], [right]) => {
  const rank = (path: string) => {
    const name = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "";
    const index = modelOrder.indexOf(name);
    return index < 0 ? modelOrder.length : index;
  };
  return rank(left) - rank(right);
});

const uploadedImages = [
  ...orderedModelFiles.map(([filePath, src]) => ({
    src,
    alt: `${imageLabel(filePath)} water purifier model`,
  })),
  ...Object.entries(projectFiles).map(([filePath, src]) => ({
    src,
    alt: `${imageLabel(filePath)} completed water purification installation`,
  })),
];

const baseUrl = import.meta.env.BASE_URL;
const showcaseImages = uploadedImages.length
  ? uploadedImages
  : [
      {
        src: `${baseUrl}BG_homepage1.png`,
        alt: "Energy System water purifier and industrial RO plant",
      },
      {
        src: `${baseUrl}water%20atm/water%20atm%20machine.jpg.png`,
        alt: "Energy System community Water ATM installation",
      },
    ];

const heroMarker = '<div data-react-home-hero="true"></div>';

function readPage(documentSource: string, isHome: boolean) {
  const parsed = new DOMParser().parseFromString(documentSource, "text/html");
  parsed.body.querySelectorAll("script").forEach((script) => script.remove());

  if (isHome) {
    const solutionCards = parsed.body.querySelectorAll(
      ".grid-3 article.card .img-placeholder",
    );
    const solutionImages = [
      ["assets/ro-models/domestic-ro-purifier.jpg", "Domestic RO purifier"],
      [
        "assets/ro-models/commercial-ro-25-lph-cabinet.webp",
        "25 LPH commercial RO system",
      ],
      ["assets/BG_homepage1.png", "Industrial RO plant and purification system"],
      ["assets/water atm/water atm machine.jpg.png", "Community Water ATM"],
    ];
    solutionImages.forEach(([src, alt], index) => {
      const placeholder = solutionCards[index];
      if (!placeholder) return;
      const image = parsed.createElement("img");
      image.setAttribute("src", src);
      image.setAttribute("alt", alt);
      image.setAttribute("class", "category-product-image");
      image.setAttribute("loading", "lazy");
      placeholder.replaceWith(image);
    });
  }

  if (documentSource === domesticDocument) {
    const firstProductCard = parsed.body.querySelector(
      ".grid-3 article.card .img-placeholder",
    );
    if (firstProductCard) {
      const image = parsed.createElement("img");
      image.setAttribute("src", "../assets/ro-models/domestic-ro-purifier.jpg");
      image.setAttribute("alt", "Domestic RO water purifier model");
      image.setAttribute("class", "product-card-image");
      image.setAttribute("loading", "lazy");
      firstProductCard.replaceWith(image);
      const firstProductTitle = parsed.body.querySelector(
        ".grid-3 article.card .card-title",
      );
      if (firstProductTitle) firstProductTitle.textContent = "Domestic RO Purifier";
      const firstProductDescription = parsed.body.querySelector(
        ".grid-3 article.card .card-desc",
      );
      if (firstProductDescription) {
        firstProductDescription.textContent =
          "Model shown. Domestic systems are available in capacities from 12 to 100 LPH; ask us to match a model to your household needs.";
      }
    }
  }

  if (documentSource === commercialDocument) {
    const productGallery = parsed.body.querySelector(".product-gallery");
    if (productGallery) {
      productGallery.replaceChildren();
      [
        [
          "../assets/ro-models/commercial-ro-25-lph-cabinet.webp",
          "25 LPH commercial RO system in a cabinet frame",
        ],
        [
          "../assets/ro-models/commercial-ro-25-lph-open-frame.jpg",
          "25 LPH commercial RO system in an open frame",
        ],
      ].forEach(([src, alt]) => {
        const image = parsed.createElement("img");
        image.setAttribute("src", src);
        image.setAttribute("alt", alt);
        image.setAttribute("class", "product-gallery-image");
        image.setAttribute("loading", "lazy");
        productGallery.append(image);
      });
    }
  }

  if (documentSource === industrialDocument) {
    const productGallery = parsed.body.querySelector(".product-gallery");
    if (productGallery) {
      productGallery.replaceChildren();
      const image = parsed.createElement("img");
      image.setAttribute("src", "../assets/ro-models/industrial-ro-1000-lph.webp");
      image.setAttribute("alt", "1000 LPH stainless steel industrial RO plant with pretreatment vessels, pump, control panel and membrane housing");
      image.setAttribute("class", "product-gallery-image industrial-product-image");
      image.setAttribute("loading", "eager");
      productGallery.append(image);
    }
  }

  const addBaseToAssets = (markup: string) =>
    markup.replace(/(?:\.\.\/)?assets\//g, baseUrl);
  let markup = addBaseToAssets(parsed.body.innerHTML);

  if (isHome) {
    const hero = parsed.body.querySelector("section.hero");
    if (hero) {
      hero.outerHTML = heroMarker;
      markup = addBaseToAssets(parsed.body.innerHTML);
    }
  }

  return { title: parsed.title, markup };
}

function HomeHero() {
  return (
    <section className="home-tilted-hero relative w-full overflow-hidden">
      <img className="home-wallpaper" src={homeWallpaper} alt="" aria-hidden="true" />
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
    </section>
  );
}

function HomeProductShowcase() {
  return (
    <section className="home-showcase" aria-labelledby="home-showcase-title">
      <div className="home-showcase-heading">
        <span className="home-showcase-eyebrow">Made for your water needs</span>
        <h2 id="home-showcase-title">Find the right RO system</h2>
        <p>From compact home purifiers to high-capacity commercial plants, explore a few of our models.</p>
        <a href="pages/commercial-ro.html" className="home-showcase-link">Explore our systems <span aria-hidden="true">→</span></a>
      </div>
      <TiltedGridHero
        images={showcaseImages}
        speed={3.2}
        tileHeight={60}
        aspectRatio={1.15}
        curveImages={false}
        gap={8}
        axis={52}
        curve={64}
        fade={12}
        className="home-product-carousel relative w-full overflow-hidden"
        aria-label="Revolving gallery of Energy System RO models and completed installations"
      />
      <p className="home-showcase-note">A selection of domestic, commercial and project systems · Ask us about specifications and availability</p>
    </section>
  );
}

export default function App() {
  const pathname = window.location.pathname;
  const currentPath = pathname.startsWith(baseUrl)
    ? `/${pathname.slice(baseUrl.length)}`
    : pathname;
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
      <HomeProductShowcase />
      <div className="legacy-page" dangerouslySetInnerHTML={{ __html: afterHero }} />
    </>
  );
}
