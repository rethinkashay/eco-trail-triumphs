import React from "react";
import { Home } from "lucide-react";

interface MilestoneEquivalentsProps {
  co2SavedKg: number;
}

// Simplified: single equivalent line only
const HOME_DAY_KG = 15; // approx. kg CO₂ per household-day

const MilestoneEquivalents: React.FC<MilestoneEquivalentsProps> = ({ co2SavedKg }) => {
  const daysPowered = Math.max(1, Math.round(co2SavedKg / HOME_DAY_KG));

  return (
    <div aria-label="impact-equivalents" className="rounded-xl border bg-card p-4 md:p-5">
      <div className="flex items-center gap-3">
        <Home className="text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Enough to power a home {" "}
          <span className="font-semibold text-foreground">
            {daysPowered} day{daysPowered === 1 ? "" : "s"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MilestoneEquivalents;
