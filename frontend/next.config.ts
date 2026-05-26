import type { NextConfig } from "next";

// Validate required environment variables at build time in production
if (process.env.NODE_ENV === "production" || process.env.VALIDATE_ENV === "true") {
  const requiredEnv = [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  ];
  
  const missing = requiredEnv.filter((name) => !process.env[name]);
  
  if (missing.length > 0) {
    throw new Error(
      `\n\n[AURA Config Error] Missing required build-time environment variables:\n` +
      missing.map((name) => `  - ${name}`).join("\n") +
      `\n\nPlease add them to your environment variables or .env.local file before building.\n`
    );
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
