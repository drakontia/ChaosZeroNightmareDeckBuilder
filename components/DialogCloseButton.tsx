"use client";

import { useTransition } from "react";
import { Button, type ButtonProps } from "./ui/button";
import { useTranslations } from "next-intl";

interface DialogCloseButtonProps extends ButtonProps {
  className?: string;
  label?: string;
}

export function DialogCloseButton({
  className = "absolute right-12 top-4",
  label,
  ...buttonProps
}: DialogCloseButtonProps) {
  const t = useTranslations();
  const resolvedLabel = label ?? t("common.remove", { defaultValue: "外す" });

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      className={className}
      aria-label={resolvedLabel}
      {...buttonProps}
    >
      <span className="text-sm font-medium">{resolvedLabel}</span>
    </Button>
  );
}
