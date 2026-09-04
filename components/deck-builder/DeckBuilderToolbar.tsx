import { Camera, Eraser, FolderOpen, Save as SaveIcon, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DeckBuilderToolbarProps {
  disabled: boolean;
  isSharing: boolean;
  isExporting: boolean;
  onSave: () => void;
  onLoad: () => void;
  onShare: () => void;
  onExport: () => void;
  onClear: () => void;
  saveLabel: string;
  loadLabel: string;
  shareLabel: string;
  exportLabel: string;
  clearLabel: string;
}

const toolbarButtons = [
  { key: "save", icon: SaveIcon },
  { key: "load", icon: FolderOpen },
  { key: "share", icon: Share2 },
  { key: "export", icon: Camera },
  { key: "clear", icon: Eraser },
] as const;

export function DeckBuilderToolbar(props: DeckBuilderToolbarProps) {
  const labels = {
    save: props.saveLabel,
    load: props.loadLabel,
    share: props.shareLabel,
    export: props.exportLabel,
    clear: props.clearLabel,
  };
  const handlers = {
    save: props.onSave,
    load: props.onLoad,
    share: props.onShare,
    export: props.onExport,
    clear: props.onClear,
  };

  return (
    <div className="col-span-1 md:col-span-8 lg:col-span-8 flex justify-end gap-2">
      {toolbarButtons.map(({ key, icon: Icon }) => (
        <Button
          key={key}
          onClick={handlers[key]}
          variant={key === "clear" ? "destructive" : "secondary"}
          disabled={
            key === "save" || key === "share"
              ? props.disabled
              : key === "export"
                ? props.isExporting
                : false
          }
          title={labels[key]}
          aria-label={labels[key]}
        >
          <Icon className="lg:mr-2 h-4 w-4" />
          <span className="hidden lg:inline">{labels[key]}</span>
        </Button>
      ))}
    </div>
  );
}
