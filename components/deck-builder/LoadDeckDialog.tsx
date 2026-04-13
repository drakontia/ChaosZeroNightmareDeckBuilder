import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SavedDeckItem {
  name: string;
  savedAt: string;
}

interface LoadDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedList: SavedDeckItem[];
  title: string;
  emptyLabel: string;
  loadLabel: string;
  deleteLabel: string;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export function LoadDeckDialog(props: LoadDeckDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-80 overflow-auto">
          {props.savedList.length === 0 ? <div className="text-sm text-muted-foreground">{props.emptyLabel}</div> : props.savedList.map(({ name, savedAt }) => (
            <div key={name} className="flex items-center justify-between rounded border p-2 gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{name}</div>
                <div className="text-xs text-muted-foreground">{new Date(savedAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => props.onLoad(name)}>{props.loadLabel}</Button>
                <Button variant="destructive" aria-label={`${props.deleteLabel}: ${name}`} onClick={() => props.onDelete(name)}>{props.deleteLabel}</Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
