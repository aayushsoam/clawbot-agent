import { useState, useRef, useEffect } from "react";
import { Settings, Info } from "lucide-react";
import { useSidebarStatus } from "@/hooks/useSidebarStatus";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { PluginSlot } from "@/plugins";

export function SidebarFooter() {
  const status = useSidebarStatus();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative flex flex-col shrink-0",
        "border-t border-foreground/8",
        "py-2",
      )}
    >
      <div className="flex items-center gap-2 px-3">
        <PluginSlot name="header-right" />
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
          className={cn(
            "flex-1 my-1 px-4 py-2 rounded-lg flex items-center gap-3",
            "font-sans text-[0.85rem] tracking-wide text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]",
            "transition-all cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30",
            open && "text-foreground bg-foreground/[0.03]"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </button>
      </div>

      {open && (
        <div
          className={cn(
            "absolute left-3 bottom-full mb-2 w-60 z-50 p-4 space-y-4",
            "border border-foreground/10 rounded-lg bg-background-base/95 backdrop-blur-md",
            "shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]",
          )}
        >
          {/* Header */}
          <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-foreground/45 border-b border-foreground/8 pb-1.5 flex items-center gap-1.5">
            <Settings className="h-3 w-3" />
            <span>Settings</span>
          </div>

          {/* Theme row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-foreground/70 font-sans">Theme</span>
            <ThemeSwitcher />
          </div>

          {/* Language row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-foreground/70 font-sans">Language</span>
            <LanguageSwitcher dropUp />
          </div>

          {/* Divider */}
          <div className="border-t border-foreground/8 pt-3 mt-1 flex flex-col gap-1.5">
            {/* About heading */}
            <div className="text-[0.65rem] font-semibold tracking-wider uppercase text-foreground/45 flex items-center gap-1.5">
              <Info className="h-3 w-3" />
              <span>About</span>
            </div>

            {/* App details */}
            <div className="flex flex-col gap-0.5 text-xs px-1 text-foreground/75 font-sans">
              <span className="font-semibold text-foreground/95">Clawbot</span>
              <span className="text-[10px] text-muted-foreground/80">
                Version {status?.version != null ? `v${status.version}` : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
