import React, { useMemo } from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingLeavesProps {
  count?: number;
  className?: string;
}

const FloatingLeaves: React.FC<FloatingLeavesProps> = ({ count = 12, className }) => {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 2,
        size: 16 + Math.random() * 8,
        rotate: -15 + Math.random() * 30,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    [count]
  );

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {leaves.map((l) => (
        <Leaf
          key={l.id}
          className="text-primary"
          style={{
            position: "absolute",
            bottom: -20,
            left: `${l.left}%`,
            width: l.size,
            height: l.size,
            opacity: l.opacity,
            transform: `rotate(${l.rotate}deg)`,
            animation: `leaf-float ${l.duration}s ease-in-out ${l.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingLeaves;
