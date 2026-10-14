import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";

const images = [
  {
    src: "/assets/BG_homepage1.png",
    alt: "Domestic purifier and industrial RO system",
  },
  {
    src: "/assets/water%20atm/water%20atm%20machine.jpg.png",
    alt: "Energy System community Water ATM installation",
  },
];

export function TiltedGridHeroDemo() {
  return (
    <TiltedGridHero images={images} className="home-tilted-hero h-[560px] w-full">
      <div className="home-hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1>Pure water. Built for every scale.</h1>
        <p>RO models and water treatment installations by Energy System.</p>
      </div>
    </TiltedGridHero>
  );
}
