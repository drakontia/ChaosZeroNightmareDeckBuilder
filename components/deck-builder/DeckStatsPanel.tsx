import { Book, BookCopy, BookX, Brain } from "lucide-react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface DeckStatsPanelProps {
  totalCards: number;
  faintMemoryPoints: number;
  faintMemoryUnitLabel: string;
  copiedCards: number;
  maxCopiedCards: number;
  removedCards: number;
  maxRemovedCards: number;
  totalCardsLabel: string;
  faintMemoryLabel: string;
  copiedCardsLabel: string;
  removedCardsLabel: string;
}

const statLabelClass = "text-sm sm:text-base md:text-lg lg:text-2xl text-gray-500";
const statValueClass = "text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-500";

export function DeckStatsPanel(props: DeckStatsPanelProps) {
  const rows = [
    { icon: Book, label: props.totalCardsLabel, value: props.totalCards, testId: "total-cards" },
    {
      icon: Brain,
      label: props.faintMemoryLabel,
      value: `${props.faintMemoryPoints} ${props.faintMemoryUnitLabel}`,
      testId: "faint-memory",
      valueTestId: "faint-memory-points",
    },
    {
      icon: BookCopy,
      label: props.copiedCardsLabel,
      value: `${props.copiedCards} / ${props.maxCopiedCards}`,
      testId: "copied-cards",
    },
    {
      icon: BookX,
      label: props.removedCardsLabel,
      value: `${props.removedCards} / ${props.maxRemovedCards}`,
      testId: "removed-cards",
    },
  ];

  return (
    <FieldGroup className="gap-2">
      {rows.map(({ icon: Icon, label, value, testId, valueTestId }) => (
        <Field
          key={label}
          orientation="horizontal"
          className={label === props.removedCardsLabel ? undefined : "border-b"}
          data-testid={testId}
        >
          <FieldLabel className={statLabelClass}>
            <Icon className="align-middle" />
            {label}
          </FieldLabel>
          <div className="flex justify-between items-center p-1">
            <span className={statValueClass} data-testid={valueTestId}>
              {value}
            </span>
          </div>
        </Field>
      ))}
    </FieldGroup>
  );
}
