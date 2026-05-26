import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/Navbar";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      {children}
    </SmoothScrollProvider>
  );
}
