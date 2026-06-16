import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "secondary-on-dark"
  | "text-link"
  | "primary-on-coral";

type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium leading-none " +
  "transition-colors duration-150 ease-out disabled:cursor-not-allowed " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-primary focus-visible:ring-offset-canvas";

const sizeStyles: Record<Size, string> = {
  md: "h-10 px-5 text-[14px] rounded-md",
  lg: "h-12 px-7 text-[15px] rounded-md",
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-active active:bg-primary-active " +
    "disabled:bg-primary-disabled disabled:text-muted",
  secondary:
    "bg-canvas text-ink border border-hairline hover:bg-surface-soft " +
    "active:bg-surface-card disabled:text-muted",
  "secondary-on-dark":
    "bg-surface-dark-elevated text-on-dark border border-surface-dark-elevated " +
    "hover:bg-surface-dark-soft",
  "primary-on-coral":
    "bg-white !text-ink font-semibold hover:bg-surface-soft active:bg-surface-card",
  "text-link":
    "h-auto p-0 bg-transparent text-ink hover:text-primary underline-offset-4 " +
    "hover:underline rounded-none",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const classes = [
    base,
    variant === "text-link" ? "" : sizeStyles[size],
    variantStyles[variant],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
