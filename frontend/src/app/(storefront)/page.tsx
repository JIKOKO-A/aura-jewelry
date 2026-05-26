import Hero from "@/components/Hero";
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
