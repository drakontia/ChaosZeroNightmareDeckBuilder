import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface LimitAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  closeLabel?: string;
}

export function LimitAlert({
  isOpen,
  title,
  message,
  onClose,
  closeLabel = '閉じる',
}: LimitAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div className="flex items-start gap-3">
          <div>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={closeLabel}
            onClick={onClose}
            className="ml-auto shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}
