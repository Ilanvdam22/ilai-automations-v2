import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { body, button, container, h1, textLink } from "@/components/site/ui";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-black pb-24 pt-40 text-white">
        <div className={container}>
          <p className="font-mono text-sm tracking-[0.2em] text-accent">404</p>
          <h1 className={`${h1} mt-6 max-w-3xl`}>Deze pagina bestaat niet.</h1>
          <p className={`${body} mt-8 max-w-xl text-lg`}>
            Misschien is de link verouderd of zit er een typfout in. Hier kom je wel verder:
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/" className={button}>
              Naar de homepage
            </Link>
            <Link href="/diensten" className={textLink}>
              Diensten
            </Link>
            <Link href="/contact" className={textLink}>
              Contact
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
