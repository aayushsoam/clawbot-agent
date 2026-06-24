import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-border bg-card/60 px-3 py-1 font-courier text-sm",
        "transition-[background-color,border-color] duration-200 ease-out",
        "hover:bg-card/85 hover:border-foreground/15",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:bg-card focus-visible:border-foreground/20 focus-visible:ring-1 focus-visible:ring-foreground/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
