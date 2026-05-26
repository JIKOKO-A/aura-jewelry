import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductProps {
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ name, price, image, category }: ProductProps) {
  const router = useRouter();
  return (
    <Link href={`/shop/${name.toLowerCase().replace(/\s+/g, '-')}`} className="group cursor-pointer flex flex-col w-full">
      <div className="relative overflow-hidden aspect-[4/5] mb-5 bg-foreground/5 rounded-sm">
        <Image 
          src={image} 
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Hover Add to Cart Button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 w-[90%] z-10">
          <button 
            onClick={(e) => {
              e.preventDefault();
              router.push('/checkout');
            }}
            className="w-full bg-background text-foreground py-3 font-sans text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            <ShoppingBag size={14} strokeWidth={1.5} /> Add to Bag
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start px-1">
        <div>
          <p className="font-sans text-[10px] text-foreground/50 uppercase tracking-[0.2em] mb-1">{category}</p>
          <h3 className="font-serif text-lg text-foreground group-hover:text-gold transition-colors duration-300">{name}</h3>
        </div>
        <p className="font-sans text-sm tracking-widest text-foreground">{price}</p>
      </div>
    </Link>
  );
}
