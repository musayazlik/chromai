import { Hero } from "@/components/chromai/hero";
import { PaletteGenerator } from "@/components/chromai/palette-generator";
import { Faq } from "@/components/chromai/faq";
import { Founder } from "@/components/chromai/founder";

export default function Home() {
  return (
    <div
      id="top"
      className="mx-auto w-full max-w-[1040px] px-6 pb-24 pt-12 sm:pt-16"
    >
      <Hero />
      <PaletteGenerator />
      <Faq />
      <Founder />
    </div>
  );
}
