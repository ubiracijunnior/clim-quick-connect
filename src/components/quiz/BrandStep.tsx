import { useState } from "react";
import { Check } from "lucide-react";
import { QuizInput } from "./QuizInput";

const BRANDS = [
  "Samsung",
  "LG",
  "Springer Midea",
  "Gree",
  "Daikin",
  "Fujitsu",
  "Hitachi",
  "Carrier",
  "Consul",
  "Electrolux",
  "Philco",
  "Elgin",
  "Agratto",
  "Comfee",
  "TCL",
  "Outra",
];

interface BrandStepProps {
  value: string;
  onChange: (val: string) => void;
}

export function BrandStep({ value, onChange }: BrandStepProps) {
  const isOther = value !== "" && !BRANDS.slice(0, -1).includes(value);
  const [showCustom, setShowCustom] = useState(isOther && value !== "Outra");

  const handleSelect = (brand: string) => {
    if (brand === "Outra") {
      setShowCustom(true);
      onChange("");
    } else {
      setShowCustom(false);
      onChange(brand);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {BRANDS.map((brand) => {
        const selected = brand === "Outra" ? showCustom : value === brand;
        return (
          <button
            key={brand}
            onClick={() => handleSelect(brand)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left font-medium text-sm transition-all duration-200 active:scale-[0.97] ${
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
            <span>{brand}</span>
          </button>
        );
      })}

      {showCustom && (
        <div className="mt-1">
          <QuizInput
            value={value}
            onChange={onChange}
            placeholder="Digite a marca…"
            maxLength={20}
            minLength={2}
          />
        </div>
      )}
    </div>
  );
}
