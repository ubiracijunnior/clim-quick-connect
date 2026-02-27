import { Check } from "lucide-react";

interface RadioCardsProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  columns?: 1 | 2;
}

export function RadioCards({ options, value, onChange, columns = 1 }: RadioCardsProps) {
  return (
    <div
      className={`grid gap-3 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}
    >
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left font-medium text-sm transition-all duration-200 active:scale-[0.97] ${
              selected
                ? "border-quiz-selected bg-quiz-hover text-foreground shadow-sm"
                : "border-quiz-border bg-card text-foreground hover:border-muted-foreground/30"
            }`}
          >
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected
                  ? "border-quiz-selected bg-quiz-selected"
                  : "border-quiz-border"
              }`}
            >
              {selected && <Check size={12} className="text-primary-foreground" />}
            </div>
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
