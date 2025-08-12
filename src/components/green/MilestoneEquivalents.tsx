import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, TreePine, Car } from "lucide-react";

interface MilestoneEquivalentsProps {
  co2SavedKg: number;
}

type Region = "Germany" | "United States" | "Australia";

const REGION_FACTORS: Record<Region, { homeDayKg: number; carKgPerKm: number; treeKgPerYear: number }> = {
  Germany: { homeDayKg: 15, carKgPerKm: 0.16, treeKgPerYear: 21 },
  "United States": { homeDayKg: 20, carKgPerKm: 0.25, treeKgPerYear: 21 },
  Australia: { homeDayKg: 18, carKgPerKm: 0.21, treeKgPerYear: 21 },
};

const MilestoneEquivalents: React.FC<MilestoneEquivalentsProps> = ({ co2SavedKg }) => {
  const [region, setRegion] = React.useState<Region>("Germany");
  const factors = REGION_FACTORS[region];

  const daysPowered = Math.max(1, Math.round(co2SavedKg / factors.homeDayKg));
  const treesPlanted = Math.max(1, Math.round(co2SavedKg / factors.treeKgPerYear));
  const kmDriven = Math.max(1, Math.round(co2SavedKg / factors.carKgPerKm));

  return (
    <div className="glass-panel rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">World-Centric Milestones</h3>
        <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(REGION_FACTORS).map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <li className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Home className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Enough to power a home</p>
            <p className="font-semibold">{daysPowered} day{daysPowered === 1 ? "" : "s"}</p>
          </div>
        </li>
        <li className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <TreePine className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Equivalent to trees planted</p>
            <p className="font-semibold">{treesPlanted} tree{treesPlanted === 1 ? "" : "s"}</p>
          </div>
        </li>
        <li className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Car className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Km of driving avoided</p>
            <p className="font-semibold">{kmDriven.toLocaleString()} km</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MilestoneEquivalents;
