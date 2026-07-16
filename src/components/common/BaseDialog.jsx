import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BaseDialog = memo(
  ({
    isOpen,
    onClose,
    title,
    description,
    headerContent,
    footerContent,
    className = "",
    maxWidthClass = "sm:max-w-[460px]",
    children,
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className={`${maxWidthClass} rounded-2xl p-6 bg-white border border-slate-100 shadow-2xl transition-all ${className}`}
        >
          {/* Render fully custom header layout OR standard Title/Description combination */}
          {headerContent ? (
            <div className="w-full">{headerContent}</div>
          ) : (
            (title || description) && (
              <DialogHeader className="pb-2">
                {title && (
                  <DialogTitle className="text-base font-bold text-slate-950 tracking-tight leading-snug">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-xs text-slate-500 font-medium pt-1">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>
            )
          )}

          {/* Core Main Viewport Slot */}
          <div className="w-full py-2">{children}</div>

          {/* Dynamic Action Control Slot */}
          {footerContent && (
            <DialogFooter className="flex flex-row gap-3 mt-4 sm:space-x-0 w-full">
              {footerContent}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);

BaseDialog.displayName = "BaseDialog";
export default BaseDialog;
