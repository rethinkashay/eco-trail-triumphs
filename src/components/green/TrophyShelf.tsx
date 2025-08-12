import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Bike, Bus, Footprints, Leaf } from "lucide-react";

const TROPHIES = [
  { icon: Trophy, title: "100 kg CO₂", status: "Unlocked", tone: "primary" },
  { icon: Bike, title: "50 Bike Trips", status: "Unlocked", tone: "accent" },
  { icon: Bus, title: "30 Bus Rides", status: "Unlocked", tone: "secondary" },
];

const UPCOMING = [
  { icon: Footprints, title: "200 km Walked", status: "Next", tone: "muted" },
  { icon: Medal, title: "250 kg CO₂", status: "Next", tone: "muted" },
  { icon: Leaf, title: "Green Streak 30d", status: "Next", tone: "muted" },
];

const toneClass: Record<string, string> = {
  primary: "border-primary/30",
  accent: "border-accent/40",
  secondary: "border-secondary",
  muted: "border-muted",
};

const TrophyShelf: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Trophy Wall</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TROPHIES.map((t, i) => (
          <Card key={i} className={`glass-panel border ${toneClass[t.tone]} hover-scale`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <t.icon className="text-primary" />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge>{t.status}</Badge>
            </CardContent>
          </Card>
        ))}
        {UPCOMING.map((t, i) => (
          <Card key={`u-${i}`} className={`border-dashed border ${toneClass[t.tone]} bg-muted/30`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-muted-foreground">
                <t.icon />
                {t.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant="secondary">{t.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrophyShelf;
