import Control from "@/components/application/landing-page/control";
import { Footer } from "@/components/application/landing-page/footer";
import Hero from "@/components/application/landing-page/hero";
import Navbar from "@/components/application/landing-page/navbar";
import PreFooter from "@/components/application/landing-page/pre-footer";
import StartShipping from "@/components/application/landing-page/start-shipping";

export default function Home() {
    return (
        <main className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <section className="flex flex-col min-h-[100dvh]">
                <Hero />
            </section>
            <StartShipping />
            <Control />
            <PreFooter />
            <Footer />
        </main>
    );
}
