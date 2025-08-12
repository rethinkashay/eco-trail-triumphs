import React, { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, MessageCircle, Share2, ImageDown } from "lucide-react";
import * as htmlToImage from "html-to-image";
import ShareCard from "./ShareCard";
import { toast } from "@/hooks/use-toast";

interface ShareBarProps {
  userName: string;
  co2SavedKg: number;
}

const ShareBar: React.FC<ShareBarProps> = ({ userName, co2SavedKg }) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const shareText = useMemo(() =>
    encodeURIComponent(`${userName} just saved ${co2SavedKg.toFixed(1)} kg of CO₂ with Green Commute! 🌿\nJoin me: ${window.location.href}`),
  [userName, co2SavedKg]);

  const handleSaveCard = async () => {
    if (!shareRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(shareRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `green-commute-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Share card saved!", description: "Share it on your favorite social apps." });
    } catch (e) {
      toast({ title: "Could not generate image", description: "Please try again." });
    }
  };

  const open = (url: string) => window.open(url, "_blank");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="hero" onClick={handleSaveCard} className="hover-scale">
          <ImageDown /> Save Share Card
        </Button>
        <Button
          variant="share"
          onClick={() => open(`https://api.whatsapp.com/send?text=${shareText}`)}
          aria-label="Share on WhatsApp"
          className="hover-scale"
        >
          <MessageCircle /> WhatsApp
        </Button>
        <Button
          variant="share"
          onClick={() => open(`https://twitter.com/intent/tweet?text=${shareText}`)}
          aria-label="Share on X"
          className="hover-scale"
        >
          <Twitter /> X
        </Button>
        <Button
          variant="share"
          onClick={() => open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${shareText}`)}
          aria-label="Share on Reddit"
          className="hover-scale"
        >
          <Share2 /> Reddit
        </Button>
        <Button
          variant="share"
          onClick={handleSaveCard}
          aria-label="Share to Instagram"
          className="hover-scale"
        >
          <Instagram /> Instagram
        </Button>
      </div>

      {/* Hidden share card for image generation */}
      <ShareCard ref={shareRef} userName={userName} co2SavedKg={co2SavedKg} />
    </div>
  );
};

export default ShareBar;
