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
  const shareText = useMemo(
    () => encodeURIComponent(`${userName} just saved ${co2SavedKg.toFixed(1)} kg of CO₂ with Green Commute! 🌿\nJoin me: ${window.location.href}`),
    [userName, co2SavedKg]
  );
  const shareTextPlain = useMemo(
    () => `${userName} just saved ${co2SavedKg.toFixed(1)} kg of CO₂ with Green Commute! 🌿\nJoin me: ${window.location.href}`,
    [userName, co2SavedKg]
  );

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

  const handleNativeShare = async () => {
    if (!shareRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(shareRef.current, { pixelRatio: 2 });
      if (!blob) throw new Error("Could not generate image");
      const fileName = `green-commute-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const shareData: any = {
        files: [file],
        title: "Green Commute Milestone",
        text: shareTextPlain,
      };

      if ((navigator as any).canShare?.(shareData)) {
        await (navigator as any).share(shareData);
        toast({ title: "Shared!", description: "Thanks for inspiring others." });
      } else if (navigator.share) {
        await navigator.share({ title: "Green Commute Milestone", text: shareTextPlain });
        toast({ title: "Shared!", description: "Image download is available if needed." });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast({ title: "Download ready", description: "Upload the image to Instagram or your favorite app." });
      }
    } catch {
      toast({ title: "Sharing not available", description: "We couldn't open the share menu. Try downloading the image instead." });
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
          onClick={handleNativeShare}
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
