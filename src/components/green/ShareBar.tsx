import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, MessageCircle, Share2, ImageDown } from "lucide-react";
import * as htmlToImage from "html-to-image";
import ShareCard from "./ShareCard";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ShareBarProps {
  userName: string;
  co2SavedKg: number;
}

const ShareBar: React.FC<ShareBarProps> = ({ userName, co2SavedKg }) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
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

  const handleOpenPreview = async () => {
    if (!shareRef.current) return;
    try {
      setGenerating(true);
      const blob = await htmlToImage.toBlob(shareRef.current, { pixelRatio: 2 });
      if (!blob) throw new Error("Could not generate image");
      const url = URL.createObjectURL(blob);
      setLastBlob(blob);
      setPreviewUrl(url);
      setPreviewOpen(true);
    } catch (e) {
      toast({ title: "Preview unavailable", description: "Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setLastBlob(null);
  };

  const handleDownloadFromPreview = () => {
    if (!lastBlob) return handleSaveCard();
    const fileName = `green-commute-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
    const url = URL.createObjectURL(lastBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleShareFromPreview = async () => {
    if (!lastBlob) return handleNativeShare();
    try {
      const fileName = `green-commute-${userName.replace(/\s+/g, "-").toLowerCase()}.png`;
      const file = new File([lastBlob], fileName, { type: "image/png" });
      const shareData: any = { files: [file], title: "Green Commute Milestone", text: shareTextPlain };
      if ((navigator as any).canShare?.(shareData)) {
        await (navigator as any).share(shareData);
        toast({ title: "Shared!", description: "Thanks for inspiring others." });
      } else if (navigator.share) {
        await navigator.share({ title: "Green Commute Milestone", text: shareTextPlain });
        toast({ title: "Shared!", description: "Image download is available if needed." });
      } else {
        handleDownloadFromPreview();
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
        <Button variant="hero" onClick={handleOpenPreview} className="hover-scale">
          <Share2 /> Preview & Share
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

      <Dialog open={previewOpen} onOpenChange={(v) => (v ? handleOpenPreview() : handleClosePreview())}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Share your Green Impact</DialogTitle>
            <DialogDescription>Preview your card, then share or download.</DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center">
            {generating ? (
              <div className="text-sm text-muted-foreground">Generating preview…</div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Green Commute share card preview" className="max-h-[60vh] w-auto rounded-xl shadow-glow" loading="lazy" />
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="share" onClick={handleShareFromPreview}>Share</Button>
            <Button variant="secondary" onClick={handleDownloadFromPreview}>Download PNG</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareBar;
