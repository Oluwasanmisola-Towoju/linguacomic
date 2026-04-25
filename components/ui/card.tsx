import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`glass-panel rounded-2xl p-5 transition hover:border-white/15 ${className}`}
      {...props}
    />
  );
}
