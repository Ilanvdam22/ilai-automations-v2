import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HomeFeatures from "@/components/sections/HomeFeatures";
import HomeCTA from "@/components/sections/HomeCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HomeFeatures />
      <HomeCTA />
      <Footer />
    </>
  );
}
