import React, { forwardRef } from "react";
import { Leaf, Award } from "lucide-react";

interface ShareCardProps {
  userName: string;
  co2SavedKg: number;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ userName, co2SavedKg }, ref) => {
  const niceNumber = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(co2SavedKg);

  return (
    <div
      ref={ref}
      className="absolute -left-[9999px] top-0 w-[1080px] h-[1080px] bg-gradient-primary rounded-2xl p-16 flex flex-col justify-between text-primary-foreground"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="text-primary-foreground/90" />
          <span className="font-semibold tracking-wide">Green Commute</span>
        </div>
        <Award className="text-primary-foreground/70" />
      </div>

      <div className="text-center space-y-6">
        <p className="uppercase tracking-widest text-sm/none opacity-90">Your Green Impact</p>
        <h1 className="text-7xl md:text-8xl font-extrabold text-gradient-primary">
          {niceNumber} kg CO₂
        </h1>
        <p className="text-xl opacity-90">{userName}, you're making the Earth smile!</p>
      </div>

      <div className="flex items-center justify-between text-sm opacity-90">
        <span>#GreenCommute</span>
        <span>Share your milestone • Inspire others</span>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";

export default ShareCard;
