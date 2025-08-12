import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloatingLeaves from "./FloatingLeaves";
import MilestoneEquivalents from "./MilestoneEquivalents";
import TrophyShelf from "./TrophyShelf";
import ShareBar from "./ShareBar";

interface GreenImpactProps {
  userName?: string;
  co2SavedKg?: number;
}

const GreenImpact: React.FC<GreenImpactProps> = ({ userName = "Alex", co2SavedKg = 123.4 }) => {
  useEffect(() => {
    document.title = "Your Green Impact – Green Commute";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Celebrate your CO₂ savings with Green Commute – milestones, trophies, and easy social sharing.");
    const link: HTMLLinkElement = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    if (!link.parentNode) document.head.appendChild(link);
  }, []);

  const niceNumber = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(co2SavedKg);
  const milestoneReached = co2SavedKg >= 100;

  return (
    <main className="min-h-screen relative bg-gradient-subtle">
      <section className="relative px-4 py-8 max-w-md mx-auto">
        <Card className="relative overflow-hidden border-none glass-panel shadow-glow">
          <CardContent className="p-6 md:p-8">
            <div className="relative">
              {milestoneReached && <FloatingLeaves className="-z-10" />}

              <div className="text-center space-y-2 animate-enter">
                <p className="text-sm text-muted-foreground tracking-wide">Your Green Impact</p>
                <h1 className="text-5xl font-extrabold text-gradient-primary animate-confetti-pop">
                  {niceNumber} kg CO₂
                </h1>
                <p className="text-base text-muted-foreground">You're making the Earth smile! 🌍</p>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="hero" className="hover-scale">Keep it up</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-6">
          <MilestoneEquivalents co2SavedKg={co2SavedKg} />
          <TrophyShelf />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Share your milestone</h3>
            <ShareBar userName={userName} co2SavedKg={co2SavedKg} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default GreenImpact;
