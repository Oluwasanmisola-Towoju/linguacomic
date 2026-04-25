import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-figmaPrimary text-white shadow-glow hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90119b]/60",
  secondary:
    "border border-[#e6e7ea]/40 bg-white/5 text-slate-100 hover:bg-[#fcedfd]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6e7ea]/60",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6e7ea]/60"
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
