import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
import FeaturedCollections from "@/components/FeaturedCollections";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <FeaturedCollections />
      
      {/* 
        Future Sections:
        - Best Sellers
        - Story/Brand Identity 
        - Newsletter
        - Footer
      */}
    </main>
  );
}
