"use client";

import { useTransition } from "react";
import { Button, type ButtonProps } from "./ui/button";
import { useTranslations } from "next-intl";

interface DialogCloseButtonProps extends ButtonProps {
  className?: string;
}

export function DialogCloseButton({
  className = "absolute right-12 top-4",
  ...buttonProps
}: DialogCloseButtonProps) {
  const t = useTranslations()

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      className={className}
      {...buttonProps}
    >
      <span className="text-sm font-medium">{t('common.remove', { defaultValue: '外す' })}</span>
      <span className="sr-only">{t('common.remove', { defaultValue: '外す' })}</span>
    </Button>
  );
}
