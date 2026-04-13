import { Book, BookCopy, BookX, Brain, Clock12 } from "lucide-react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface DeckStatsPanelProps {
  createdAt: Date;
  totalCards: number;
  faintMemoryPoints: number;
  copiedCards: number;
  removedCards: number;
  createdDateLabel: string;
  totalCardsLabel: string;
  faintMemoryLabel: string;
  copiedCardsLabel: string;
  removedCardsLabel: string;
}

const statLabelClass = "text-sm sm:text-base md:text-lg lg:text-2xl text-gray-500";
const statValueClass = "text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-500";

const formatDeckDate = (createdAt: Date) => {
  const yy = String(createdAt.getFullYear()).slice(-2);
  const mm = String(createdAt.getMonth() + 1).padStart(2, "0");
  const dd = String(createdAt.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

export function DeckStatsPanel(props: DeckStatsPanelProps) {
  const rows = [
    { icon: Clock12, label: props.createdDateLabel, value: formatDeckDate(props.createdAt), testId: undefined },
    { icon: Book, label: props.totalCardsLabel, value: props.totalCards, testId: "total-cards" },
    { icon: Brain, label: props.faintMemoryLabel, value: `${props.faintMemoryPoints} points`, testId: "faint-memory", valueTestId: "faint-memory-points" },
    { icon: BookCopy, label: props.copiedCardsLabel, value: props.copiedCards, testId: "copied-cards" },
    { icon: BookX, label: props.removedCardsLabel, value: props.removedCards, testId: "removed-cards" },
  ];

  return (
    <FieldGroup className="gap-2">
      {rows.map(({ icon: Icon, label, value, testId, valueTestId }) => (
        <Field key={label} orientation="horizontal" className={label === props.removedCardsLabel ? undefined : "border-b"} data-testid={testId}>
          <FieldLabel className={statLabelClass}>
            <Icon className="align-middle" />
            {label}
          </FieldLabel>
          <div className="flex justify-between items-center p-1">
            <span className={statValueClass} data-testid={valueTestId}>{value}</span>
          </div>
        </Field>
      ))}
    </FieldGroup>
  );
}
