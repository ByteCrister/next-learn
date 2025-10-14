"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface ResultCopyDialogProps {
  open: boolean;
  onClose: () => void;
  resultShareLink: string;
}

export default function ResultCopyDialog({
  open,
  onClose,
  resultShareLink,
}: ResultCopyDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultShareLink);
      setCopied(true);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (copied) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg rounded-2xl border border-slate-200/20 
                   bg-gradient-to-br from-background/90 to-background/70 
                   backdrop-blur-xl shadow-2xl transition-all p-6"
        onInteractOutside={(e) => {
          if (!copied) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-indigo-600">
            Share your result
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Copy or open your unique result link before closing this dialog.
          </DialogDescription>
        </DialogHeader>

        {/* Link box */}
        <div className="mt-6 rounded-xl border border-slate-200/30 
                        bg-slate-50/60 dark:bg-slate-800/40 
                        p-4 shadow-inner transition-colors">
          <div className="max-h-24 overflow-y-auto font-mono text-xs text-foreground break-all">
            {resultShareLink}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={() => window.open(resultShareLink, "_blank")}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-slate-700"
            >
              <ExternalLink className="w-4 h-4" /> Open
            </Button>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleCopy}
                variant={copied ? "secondary" : "outline"}
                size="sm"
                className={`flex items-center gap-1 transition-colors ${
                  copied
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "hover:bg-indigo-50 dark:hover:bg-slate-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Warning / Close */}
        <AnimatePresence>
          {!copied && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 mt-3"
            >
              You must copy the link before closing.
            </motion.p>
          )}
        </AnimatePresence>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Close
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
