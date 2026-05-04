import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Circle, TrendingDown, TrendingUp } from "lucide-react";
import type { Trend } from "../lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("card__title", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("card__description", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card__content", className)} {...props} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn("button", `button--${variant}`, className)} {...props} />;
}

export function LinkButton({
  className,
  variant = "outline",
  ...props
}: HTMLAttributes<HTMLAnchorElement> & { href: string; target?: string; rel?: string; variant?: "primary" | "outline" | "ghost" }) {
  return <a className={cn("button", `button--${variant}`, className)} {...props} />;
}

export function Badge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone = normalized.includes("blocked") || normalized.includes("failed") || normalized.includes("urgent")
    ? "danger"
    : normalized.includes("approval") || normalized.includes("review") || normalized.includes("pending")
      ? "warning"
      : normalized.includes("success") || normalized.includes("complete") || normalized.includes("won") || normalized.includes("enabled")
        ? "success"
        : "neutral";

  return <span className={`badge badge--${tone}`}>{value}</span>;
}

export function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp className="icon icon--success" aria-hidden="true" />;
  if (trend === "down") return <TrendingDown className="icon icon--danger" aria-hidden="true" />;
  return <Circle className="icon icon--muted icon--small" aria-hidden="true" />;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state" data-testid="state-empty">
      <AlertCircle className="empty-state__icon" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function SuccessNotice({ children }: { children: ReactNode }) {
  return (
    <div className="notice notice--success" role="status">
      <CheckCircle2 className="notice__icon" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <div className="notice notice--error" role="alert">
      <AlertCircle className="notice__icon" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
