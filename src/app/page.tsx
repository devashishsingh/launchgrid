import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import Problem from "@/components/Problem";
import Insight from "@/components/Insight";
import Solution from "@/components/Solution";
import WhatWeAre from "@/components/WhatWeAre";
import WhatWeProvide from "@/components/WhatWeProvide";
import HowItWorks from "@/components/HowItWorks";
import Audience from "@/components/Audience";
import Emotional from "@/components/Emotional";
import ActivationHook from "@/components/ActivationHook";
import Trust from "@/components/Trust";
import TrustBadge from "@/components/TrustBadge";
import AdminPower from "@/components/AdminPower";
import FinalCTA from "@/components/FinalCTA";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeTicker />
        <ScrollReveal><Problem /></ScrollReveal>
        <ScrollReveal><Insight /></ScrollReveal>
        <ScrollReveal><Solution /></ScrollReveal>
        <div className="h-12" />
        <ScrollReveal><WhatWeProvide /></ScrollReveal>
        <ScrollReveal><WhatWeAre /></ScrollReveal>
        <ScrollReveal><HowItWorks /></ScrollReveal>
        <div className="h-12" />
        <ScrollReveal><Audience /></ScrollReveal>
        <ScrollReveal><Emotional /></ScrollReveal>
        <ScrollReveal><ActivationHook /></ScrollReveal>
        <div className="h-12" />
        <ScrollReveal><Trust /></ScrollReveal>
        <ScrollReveal><TrustBadge /></ScrollReveal>
        <ScrollReveal><AdminPower /></ScrollReveal>
        <ScrollReveal><FinalCTA /></ScrollReveal>
        <div className="h-12" />
        <ScrollReveal><LeadCaptureForm /></ScrollReveal>
        <ScrollReveal><ContactForm /></ScrollReveal>
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
