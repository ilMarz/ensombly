"use client";

import { useEffect, useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#0A66C2]">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#1877F2]">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8] text-[#E1306C]">
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.1" className="fill-current stroke-none" />
  </svg>
);

export function ShareButton({
  projectId,
  title,
  tagline,
}: {
  projectId: string;
  title: string;
  tagline?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const shareUrl = () => `${window.location.origin}/projects/${projectId}`;
  const shareText = () => (tagline ? `${title} — ${tagline}` : title);

  const openIntent = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const handleLinkedIn = () =>
    openIntent(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl())}`);

  const handleFacebook = () =>
    openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl())}`);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl());
    setCopied(true);
  };

  const handleInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText(), url: shareUrl() });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    await navigator.clipboard.writeText(shareUrl());
    setCopied(true);
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: shareText(), url: shareUrl() });
    } catch {
      /* cancelled */
    }
  };

  const rowClass =
    "flex items-center gap-3 w-full rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors duration-150";

  return (
    <>
      <Button variant="outline" className="rounded-full gap-2" onClick={() => setOpen(true)}>
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this project</DialogTitle>
            <DialogDescription>Spread the word about {title}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2 mt-2">
            <button type="button" className={rowClass} onClick={handleLinkedIn}>
              <LinkedInIcon /> Share on LinkedIn
            </button>
            <button type="button" className={rowClass} onClick={handleFacebook}>
              <FacebookIcon /> Share on Facebook
            </button>
            <button type="button" className={rowClass} onClick={handleInstagram}>
              <InstagramIcon /> Share on Instagram
            </button>
            <button type="button" className={rowClass} onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Link copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-5 h-5 text-muted-foreground" /> Copy link
                </>
              )}
            </button>
            {canNativeShare && (
              <button type="button" className={rowClass} onClick={handleNativeShare}>
                <Share2 className="w-5 h-5 text-muted-foreground" /> Share via…
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
