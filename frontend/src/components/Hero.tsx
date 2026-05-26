"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense } from "react";

function AbstractJewelry() {
  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} scale={1.8}>
        <MeshDistortMaterial 
          color="#C5A059" 
          attach="material" 
          distort={0.4} 
          speed={1.5} 
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-background flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>
          <AbstractJewelry />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-9xl text-foreground tracking-tight pointer-events-auto"
        >
          Elegance, <br className="md:hidden" /> Redefined.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-foreground/80 font-sans max-w-lg pointer-events-auto"
        >
          Discover timeless, handcrafted jewelry that speaks the language of luxury.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-12 pointer-events-auto"
        >
          <button className="px-10 py-4 bg-foreground text-background font-sans tracking-widest text-sm uppercase transition-all hover:bg-foreground/90 hover:scale-105 duration-300">
            Explore Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
}
